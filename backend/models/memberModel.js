const { query } = require("../services/dbConnection")

module.exports.getUserByUsername = function getUserByUsername(username) {
    let sql = "SELECT * FROM members WHERE username = $1;"
    return query(sql, [username]).then(function (result) {
        return result.rows
    })
}

module.exports.insertUsers = function insertUsers(username) {
    let sql = "INSERT INTO members(username) VALUES ($1) RETURNING id, username, role;"
    return query(sql, [username]).then((result) => {
        return result.rows;
    })
}
module.exports.insertMoney = function insertMoney(memberId) {
    let sql = "INSERT INTO money_earned(money,member_id) VALUES (0,$1)  RETURNING id;"
    return query(sql, [memberId]).then((result) => {
        return result.rows;
    })
}