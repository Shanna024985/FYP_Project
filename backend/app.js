// const express = require("express");
// var session = require('express-session');
// const cookieParser = require('cookie-parser'); // Add this
// require("dotenv").config();
// let cors = require("cors");
// const path = require('path');

// let app = express();

// // CORS - Allow credentials
// app.use(cors({
//     origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000","https://fyp-project-fawn.vercel.app"],
//     credentials: true // ← IMPORTANT: Allow cookies to be sent
// }));

// app.use(express.json());
// app.use(express.urlencoded({extended: false}));

// // Cookie parser middleware
// app.use(cookieParser());

// // Session middleware - FIXED
// app.use(session({
//     secret: process.env.JWT_SECRET_KEY || 'your-secret-key', // ← Use env variable
//     resave: false, 
//     saveUninitialized: true,
//     cookie: { 
//         secure: false,  // Set to true in production with HTTPS
//         httpOnly: true,
//         maxAge: 24 * 60 * 60 * 1000 // ← 24 hours (not 2 minutes!)
//     }
// }));

// // Serve static files
// let pathForServingHtmlFile = path.join(__dirname, "dist");
// console.log(pathForServingHtmlFile);
// app.use("/", express.static(pathForServingHtmlFile));

// // Routes
// let mainRoutes = require("./routers/mainRoutes");
// app.use("/api", mainRoutes);



// // START THE SERVER
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Backend running on http://localhost:${PORT}`);
// });

// module.exports = app;
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");

const { Server } = require("ws");
const jose = require("jose");
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app);   // <-- Shared HTTP server
const wss = new Server({ server });      // <-- Attach WebSocket to it

let clients = {};

const jwtSecretKey = process.env.JWT_SECRET_KEY.trim();
const websocketSecretKey = process.env.WEBSOCKET_SECRET_KEY.trim();
const websocketPrivateKey = process.env.WEBSOCKET_PRIVATE_KEY.trim();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "https://fyp-project-fawn.vercel.app"
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: process.env.JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

const pathForServingHtmlFile = path.join(__dirname, "dist");
app.use("/", express.static(pathForServingHtmlFile));

const mainRoutes = require("./routers/mainRoutes");
app.use("/api", mainRoutes);

wss.on("connection", (ws, req) => {
    console.log("Websocket connection work")
    let params = new URLSearchParams(req.url.slice(2));

    let admin_token = params.get("admin_token");
    let token = params.get("token");

    if (token) {
        try {
            clients[jwt.verify(token, jwtSecretKey).userId] = {
                ws,
                role: "user"
            };
        } catch (err) {
            console.log(err);
        }
    }
    else if (admin_token) {
        console.log(1)

        jose.importJWK(JSON.parse(websocketPrivateKey), 'ECDH-ES+A256KW').then(privateKeyCrypto => {
            console.log(2)
            jose.compactDecrypt(admin_token, privateKeyCrypto)
            .then(result => {
                console.log(3)
                jwt.verify(
                    new TextDecoder().decode(result.plaintext),
                    jwtSecretKey,
                    (err, admin_token) => {
                        console.log(4)

                        if (admin_token.secret_key == websocketSecretKey) {
                            console.log(5)
                            clients.admin = {
                                ws,
                                role: "admin"
                            };
                        } else {
                            console.log(6)
                            ws.close();
                        }

                    }
                );

            });
        })

    }

    ws.on("message", message => {

        const messageJSON = JSON.parse(message);
        console.log(7)

        if (messageJSON.action == "update") {
            console.log(8)

            try {
                console.log(9)
                const role = Object.entries(clients)
                    .find(wsPair => wsPair[1].ws == ws)?.[0];
                console.log(10)
                if (role == "admin") {
                    console.log(11)
                    const wsUser = clients[messageJSON.userId];
                    console.log(12)
                    if (wsUser) {
                        console.log(13)
                        wsUser.ws.send(messageJSON.senderUserId);
                    }

                }

            } catch (err) {
                console.log(err);
            }

        }

    });

    ws.on("close", () => {

        const client = Object.entries(clients)
            .find(wsPair => wsPair[1].ws == ws);

        if (client) {
            delete clients[client[0]];
        }

    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Express + WebSocket running on port ${PORT}`);
});

module.exports = app;