const { query } = require("../services/dbConnection");

module.exports.getResponseDetailsByStage = jobId => {
    let sql = `WITH responses AS (SELECT status FROM application WHERE job_id = $1)
	SELECT (SELECT COUNT(*) from responses r1 WHERE r1.status = 'Screening') screening,
	(SELECT COUNT(*) from responses r2 WHERE r2.status = 'Testing') testing,
	(SELECT COUNT(*) from responses r3 WHERE r3.status = 'Interviewing') interviewing,
    (SELECT COUNT(*) from responses r4 WHERE r4.status = 'Offered') offered,
    (SELECT COUNT(*) from responses r5 WHERE r5.status = 'Onboarded') onboarded;`;
    return query(sql, [jobId]).then(function(result) {
        return result.rows;
    });
}

module.exports.getResponsesById = jobId => {
    let sql = `SELECT * FROM application WHERE job_id = $1;`;
    return query(sql, [jobId]).then(function(result) {
        return result.rows;
    });
}