const { query } = require("../services/dbConnection");

module.exports.getResumeById = id => {
    let sql = `GET * FROM resume WHERE id = $1;`;
    return query(sql, [id]).then(function(result) {
        return result.rows;
    });
}