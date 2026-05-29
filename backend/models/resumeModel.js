const { query } = require("../services/dbConnection");

module.exports.getResumeById = id => {
    let sql = `GET * FROM resume WHERE id = $1;`;
    return query(sql, [id]).then(function(result) {
        return result.rows;
    });
}

// module.exports.insertSingleResume = (userId, resumeName, resumeURL) => {
//     let sql = `INSERT INTO resume (user_id, resume_name, resume_url) VALUES (?, ?, ?) RETURNING id;`;
//     return query(sql, [userId, resumeName, resumeURL]).then(function(result) {
//         return result.rows;
//     });
// }

module.exports.insertSingleResume = (userId, resumeName, resumeData) => {
    let sql = `INSERT INTO resume (user_id, resume_name, resume_data) VALUES (?, ?, ?) RETURNING id;`;
    return query(sql, [userId, resumeName, resumeData]).then(function(result) {
        return result.rows;
    });
}

module.exports.updateDefaultResume = (resumeId, userId) => {
    let sql = `UPDATE user_detail SET default_resume_id = ? WHERE user_id = ?;`;
    return query(sql, [resumeId, userId]).then(function(result) {
        return result.rows;
    });
}