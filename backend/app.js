const express = require("express")
var session = require('express-session')
require("dotenv").config();
let cors = require("cors")
const path = require('path');
const http = require('node:http');
const socket = require('socket.io');

let app = express();
app.use(cors({
    origin: ["http://localhost:5173","http://localhost:5174","http://localhost:3000"]
}))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
// Singpass also needs session data
app.use(session({secret: 'singpassSessionData', resave: false, saveUninitialized: true, cookie: {secure: false, maxAge: 120000}}))
// socket for updating messages
const server = http.Server(app);
const io = new socket.Server();
let pathForServingHtmlFile = path.join(__dirname,"dist")
console.log(pathForServingHtmlFile)
app.use("/",express.static(pathForServingHtmlFile))

let mainRoutes = require("./routers/mainRoutes")
app.use("/api",mainRoutes)

// Catch-all for React Router
app.use((req, res) => {
    res.sendFile(path.join(pathForServingHtmlFile, "index.html"));
});

io.on('connection', socket => {
    console.log('test');
})

// START THE SERVER - ADD THIS
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});

module.exports = app;