const { query } = require("../services/dbConnection");

module.exports.getUserBySingpassId = singpassId => {
    let sql = "SELECT * FROM user_ WHERE singpass_id = $1;";
    return query(sql, [singpassId]).then(function (result) {
        return result.rows;
    });
}

module.exports.insertNewUser = singpassId => {
    let sql = "INSERT INTO user_ (singpass_id) VALUES ($1) RETURNING id;";
    return query(sql, [singpassId]).then(function (result) {
        return result.rows;
    });
}

module.exports.getUserDetailById = id => {
    let sql = "SELECT user_.id FROM user_ JOIN user_detail ON user_.id = user_detail.user_id WHERE user_.id = $1;";
    return query(sql, [id]).then(function (result) {
        return result.rows;
    });
}