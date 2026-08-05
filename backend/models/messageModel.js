const { query } = require("../services/dbConnection");
const {Server} = require('ws');
const jose = require("jose")

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
    let sql = `SELECT m.id,m.message,
    d1.user_id sender_user_id,
    d1.first_name || ' ' || d1.last_name sender_user_name,
    d1.profile_picture_file_name sender_profile_picture_file_name,
    d1.profile_picture_file_url sender_profile_picture_file_url,
    d2.user_id receiver_user_id,
    d2.first_name || ' ' || d2.last_name receiver_user_name,
    d2.profile_picture_file_name receiver_profile_picture_file_name,
    d2.profile_picture_file_url receiver_profile_picture_file_url,
    m.time_sent FROM message m
    JOIN user_detail d1 ON d1.user_id = m.sender_user_id
    JOIN user_detail d2 ON d2.user_id = m.receiver_user_id
    WHERE (sender_user_id = $1 AND receiver_user_id = $2)
    OR (receiver_user_id = $3 AND sender_user_id = $4)
    ORDER BY m.time_sent DESC OFFSET $5;`;
    return query(sql, [userId1, userId2, userId1, userId2, (page - 1) * 25]).then(function (result) {
        return result.rows;
    });
}

module.exports.getUserList = (userId) => {
    let sql = `SELECT * FROM get_conversations($1);`;
    return query(sql, [userId]).then(function (result) {
        return result.rows;
    });
}

module.exports.insertSingleMessage = (senderUserId, receiverUserId, message) => {
    let sql = `WITH new_message AS (
    INSERT INTO message (
        sender_user_id,
        receiver_user_id,
        message
    )
    VALUES ($1, $2, $3)
    RETURNING id,
              sender_user_id,
              receiver_user_id,
              message,
              time_sent
)
SELECT
    nm.id,
    nm.message,
    nm.time_sent,

    -- Sender information
    sender.user_id AS sender_id,
    sender.first_name|| ' ' || sender.last_name AS sender_user_name,
    sender.profile_picture_file_name AS sender_profile_picture_file_name,
    sender.profile_picture_file_url AS sender_profile_picture_file_url,

    -- Receiver information
    receiver.user_id AS receiver_id,
    receiver.first_name || ' ' || receiver.last_name  AS receiver_user_name,
    receiver.profile_picture_file_name AS receiver_profile_picture_file_name,
    receiver.profile_picture_file_url AS receiver_profile_picture_file_url

FROM new_message nm
INNER JOIN user_detail sender
    ON nm.sender_user_id = sender.user_id
INNER JOIN user_detail receiver
    ON nm.receiver_user_id = receiver.user_id;`;
    return query(sql, [senderUserId, receiverUserId, message]).then(function (result) {
        return result.rows;
    });
}

module.exports.updateMessageById = (message, id) => {
    let sql = `UPDATE message SET message = $1 WHERE id = $2 RETURNING id, sender_user_id, receiver_user_id;`;
    return query(sql, [message, id]).then(function (result) {
        return result.rows;
    });
}

module.exports.deleteMessageById = (id) => {
    let sql = `DELETE FROM message WHERE id = $1 RETURNING id, sender_user_id, receiver_user_id;`;
    return query(sql, [id]).then(function(result) {
        return result.rows;
    });
}

module.exports.getMessageById = (id) => {
    let sql = `SELECT * FROM message WHERE id = $1;`;
    return query(sql, [id]).then(function (result) {
        return result.rows;
    });
}

module.exports.updateMessagesToRead = (senderUserId) => {
    let sql = `UPDATE message SET read = TRUE WHERE sender_user_id = $1 AND read = FALSE;`;
    return query(sql, [senderUserId]).then(function (result) {
        return result.rows;
    });
}

module.exports.getUnreadMessageCount = (receiverUserId) => {
    let sql = `SELECT COUNT(id) unread_message_count FROM message WHERE receiver_user_id = $1 AND read = FALSE;`;
    return query(sql, [receiverUserId]).then(function (result) {
        return result.rows;
    });
}

const PORT = 3001;
// const server = new Server({port: PORT}, () => {
//     console.log(`Websocket running on ws://localhost:${PORT}`);
// });
let clients = {};
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY.trim();
const websocketSecretKey = process.env.WEBSOCKET_SECRET_KEY.trim();
const tokenDuration = process.env.JWT_EXPIRES_IN;
const tokenAlgorithm = process.env.JWT_ALGORITHM;
const websocketPublicKey = process.env.WEBSOCKET_PUBLIC_KEY.trim();
const websocketAlg = process.env.WEBSOCKET_ALG.trim();
const options = {
    // algorithm: tokenAlgorithm,
    // expiresIn: tokenDuration,
};
module.exports.sendUpdateMessage = (userId, senderUserId) => {
    jwt.sign({"secret_key":  websocketSecretKey}, jwtSecretKey, options, (err, encoded) => {
        new jose.CompactEncrypt(new TextEncoder().encode(encoded)).setProtectedHeader(JSON.parse(websocketAlg)).encrypt(JSON.parse(websocketPublicKey)).then(token => {
            const socket = new WebSocket(`ws://localhost:${PORT}?admin_token=${token}`);

            socket.addEventListener('open', ws => {
                console.log('Connected!');
                socket.send(JSON.stringify({action: 'update', userId, senderUserId}));
                socket.close();
            });

            socket.addEventListener('error', error => {
                console.error(error);
            });
        })
    })
}