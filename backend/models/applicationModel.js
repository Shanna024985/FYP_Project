const { query } = require("../services/dbConnection");

module.exports.getJobCompanyOwnershipById = jobId => {
    let sql = `SELECT user_id FROM job j JOIN company c ON j.company_id = c.id
    JOIN company_ownership o ON o.company_id = c.id`;
    return query(sql, [jobId]).then(function(result) {
        return result.rows;
    });
}

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

const responsesColumns = `SELECT a.id, first_name || ' ' || last_name candidate,
date_applied, file_name resume_name,
file_url resume_url, status, phone_number, email
FROM application a JOIN user_ u ON u.id = a.user_id
JOIN user_detail d ON u.id = d.user_id
JOIN resume r ON r.id = a.resume_id
`;

module.exports.getActiveCandidatesByJobId = jobId => {
    let sql = responsesColumns + `WHERE job_id = $1 AND status <> 'Reviewing';`;
    return query(sql, [jobId]).then(function(result) {
        return result.rows;
    });
}

module.exports.getAwaitingResponsesByJobId = jobId => {
    let sql = responsesColumns + `WHERE job_id = $1 AND status = 'Reviewing';`;
    return query(sql, [jobId]).then(function(result) {
        return result.rows;
    });
}

module.exports.getApplicationsByJobId = jobId => {
    let sql = responsesColumns + `WHERE job_id = $1;`;
    return query(sql, [jobId]).then(function(result) {
        return result.rows;
    });
}

module.exports.getActiveCandidatesByJobIdAndName = (jobId, name) => {
    let sql = responsesColumns + `WHERE job_id = $1 AND status <> 'Reviewing' AND first_name || ' ' || last_name ILIKE $2;`;
    return query(sql, [jobId, name + '%']).then(function(result) {
        return result.rows;
    });
}

module.exports.getAwaitingResponsesByJobIdAndName = (jobId, name) => {
    let sql = responsesColumns + `WHERE job_id = $1 AND status = 'Reviewing' AND first_name || ' ' || last_name ILIKE $2;`;
    return query(sql, [jobId, name + '%']).then(function(result) {
        return result.rows;
    });
}

module.exports.updateStatusById = (status, id) => {
    let sql = `UPDATE application SET status = $1 WHERE id = $2;`;
    return query(sql, [status, id]).then(function(result) {
        return result.rows;
    });
}

module.exports.getJobIdByApplicationId = (id) => {
    let sql = `GET job_id FROM application WHERE id = $1;`;
    return query(sql, [id]).then(function(result) {
        return result.rows;
    });
}