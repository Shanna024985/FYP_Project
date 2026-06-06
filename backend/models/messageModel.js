const { query } = require("../services/dbConnection");

module.exports.getMessageByUserId = (userId, page) => {
    let sql = `GET m.message,
    u1.first_name || ' ' || u1.last_name sender_name,
    u2.first_name || ' ' || u2.last_name receiver_name,
    m.time_sent FROM message m
    JOIN user_ u1 ON u1.id = m.sender_user_id
    JOIN user_u2 ON u2.id = m.receiver_user_id
    WHERE sender_user_id = $1 OR receiver_user_id = $2
    ORDER BY 4 DESC LIMIT 25 OFFSET $3;`;
    return query(sql, [userId, userId, (page - 1) * 25]).then(function(result) {
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
    let sql = `UPDATE message SET message = $1 WHERE id = $2;`;
    return query(sql, [message, id]).then(function(result) {
        return result.rows;
    });
}

module.exports.deleteMessageById = (id) => {
    let sql = `DELETE message WHERE id = $1;`;
    return query(sql, [id]).then(function(result) {
        return result.rows;
    });
}