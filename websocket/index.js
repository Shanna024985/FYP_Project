require("dotenv").config();
const {Server} = require('ws');
const jose = require("jose")

const PORT = 3001;
const server = new Server({port: PORT}, () => {
    console.log(`Websocket running on ws://localhost:${PORT}`);
});
let clients = {};
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY.trim();
const websocketSecretKey = process.env.WEBSOCKET_SECRET_KEY.trim();
const websocketPrivateKey = process.env.WEBSOCKET_PRIVATE_KEY.trim();

server.on('connection', (ws, req) => {
    let params = new URLSearchParams(req.url.slice(2));
    let admin_token = params.get('admin_token');
    let token = params.get('token');
    if (token) {
        try {
            clients[jwt.verify(token, jwtSecretKey).userId] = {ws, role: 'user'};
        } catch (err) {
            console.log(err);
        }
    } else if (admin_token) {
        jose.compactDecrypt(admin_token, JSON.parse(websocketPrivateKey)).then(result => {
            jwt.verify(new TextDecoder().decode(result.plaintext), jwtSecretKey, (err, admin_token) => {
                if (admin_token.secret_key == websocketSecretKey) {
                    clients.admin = {ws, role: 'admin'};
                } else {
                    ws.close();
                }
            });
        })
    }

    ws.on('message', message => {
        const messageJSON = JSON.parse(message);
        console.log(messageJSON);

        if (messageJSON.action == 'update') {
            try {
                const role = Object.entries(clients).find(wsPair => wsPair[1].ws == ws)[0];
                console.log(role)
                if (role == 'admin') {
                    let wsUser = clients[messageJSON.userId];
                    if (wsUser) {
                        wsUser.send(messageJSON.senderUserId);
                    } else {
                        // senderUser is not online, maybe send email to user?
                    }
                }
            } catch (err) {
                console.log(err)
            }
        }
    })

    ws.on('close', () => {
        delete clients[Object.entries(clients).find(wsPair => wsPair[1].ws == ws)[0]];
    })
})