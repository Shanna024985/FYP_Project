const { query } = require("../services/dbConnection");
const {Server} = require('ws');

// module.exports.getMessageByUserId = (userId, page) => {
//     let sql = `GET m.message,
//     u1.first_name || ' ' || u1.last_name sender_name,
//     u2.first_name || ' ' || u2.last_name receiver_name,
//     m.time_sent FROM message m
//     JOIN user_ u1 ON u1.id = m.sender_user_id
//     JOIN user_u2 ON u2.id = m.receiver_user_id
//     WHERE sender_user_id = $1 OR receiver_user_id = $2
//     ORDER BY 4 DESC LIMIT 25 OFFSET $3;`;
//     return query(sql, [userId, userId, (page - 1) * 25]).then(function(result) {
//         return result.rows;
//     });
// }

module.exports.getMessageBetweenUsers = (userId1, userId2, page) => {
    let sql = `SELECT m.message,
    u1.id sender_user_id,
    u1.first_name || ' ' || u1.last_name sender_user_name,
    u2.id receiver_user_id,
    u2.first_name || ' ' || u2.last_name receiver_user_name,
    m.time_sent FROM message m
    JOIN user_ u1 ON u1.id = m.sender_user_id
    JOIN user_ u2 ON u2.id = m.receiver_user_id
    WHERE (sender_user_id = $1 AND receiver_user_id = $2)
    OR (receiver_user_id = $3 AND sender_user_id = $4)
    ORDER BY 6 DESC LIMIT 25 OFFSET $5;`;
    return query(sql, [userId1, userId2, userId1, userId2, (page - 1) * 25]).then(function(result) {
        return result.rows;
    });
}

module.exports.getUserList = (userId) => {
    let sql = `SELECT * FROM get_user_message_list($1);`;
    return query(sql, [userId]).then(function(result) {
        return result.rows;
    });
}

module.exports.insertSingleMessage = (senderUserId, receiverUserId, message) => {
    let sql = `INSERT INTO message (sender_user_id, receiver_user_id, message)
    VALUES ($1, $2, $3) RETURNING id;`;
    return query(sql, [senderUserId, receiverUserId, message]).then(function(result) {
        return result.rows;
    });
}

module.exports.updateMessageById = (message, id) => {
    let sql = `UPDATE message SET message = $1 WHERE id = $2 RETURNING id, sender_user_id, receiver_user_id;`;
    return query(sql, [message, id]).then(function(result) {
        return result.rows;
    });
}

module.exports.deleteMessageById = (id) => {
    let sql = `DELETE message WHERE id = $1 RETURNING id, sender_user_id, receiver_user_id;`;
    return query(sql, [id]).then(function(result) {
        return result.rows;
    });
}

module.exports.getMessageById = (id) => {
    let sql = `SELECT * FROM message WHERE id = $1;`;
    return query(sql, [id]).then(function(result) {
        return result.rows;
    });
}

const PORT = 3001;
const server = new Server({port: PORT}, () => {
    console.log(`Websocket running on ws://localhost:${PORT}`);
});
let clients = {};
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY.trim();

server.on('connection', (ws, req) => {
    let params = new URLSearchParams(req.url.slice(2));
    let token = params.get('token');
    if (token) {
        try {
            clients[jwt.verify(token, secretKey).userId] = ws;
        } catch (err) {
            console.log(err);
        }
    }

    ws.on('close', (ws, req) => {
        delete clients[clients.findIndex(ws)];
    })
})

module.exports.sendUpdateMessage = (userId, senderUserId) => {
    clients[userId].send(senderUserId);
}