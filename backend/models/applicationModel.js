const { query } = require("../services/dbConnection");

module.exports.getJobCompanyOwnershipById = jobId => {
    let sql = `SELECT user_id FROM job j JOIN company c ON j.company_id = c.id
    JOIN company_ownership o ON o.company_id = c.id WHERE j.id = $1`;
    return query(sql, [jobId]).then(function(result) {
        return result.rows;
    });
}

module.exports.getResponseDetailsByStage = jobId => {
    let sql = `WITH responses AS (SELECT status FROM application WHERE job_id = $1)
	SELECT (SELECT COUNT(*) FROM responses r1 WHERE r1.status = 'Screening') screening,
	(SELECT COUNT(*) FROM responses r2 WHERE r2.status = 'Interview') interview,
	(SELECT COUNT(*) FROM responses r3 WHERE r3.status = 'Reviewing') reviewing,
    (SELECT COUNT(*) FROM responses r4 WHERE r4.status = 'Offer') offer,
    (SELECT COUNT(*) FROM responses r5 WHERE r5.status = 'Onboard') onboard;`;
    return query(sql, [jobId]).then(function(result) {
        return result.rows;
    });
}

const responsesColumns = `SELECT a.id, first_name || ' ' || last_name candidate,
time_applied, resume_file_name,
resume_file_data, status, phone_number, d.email
FROM application a JOIN user_ u ON u.id = a.user_id
JOIN user_detail d ON u.id = d.user_id
`;

module.exports.getActiveCandidatesByJobId = jobId => {
    let sql = responsesColumns + `WHERE job_id = $1 AND status IN ('Interview', 'Offer', 'Rejected');`;
    return query(sql, [jobId]).then(function(result) {
        return result.rows;
    });
}

module.exports.getAwaitingResponsesByJobId = jobId => {
    let sql = responsesColumns + `WHERE job_id = $1 AND status NOT IN ('Interview', 'Offer', 'Rejected');`;
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
    let sql = responsesColumns + `WHERE job_id = $1 AND status IN ('Interview', 'Offer', 'Rejected') AND first_name || ' ' || last_name ILIKE $2;`;
    return query(sql, [jobId, name + '%']).then(function(result) {
        return result.rows;
    });
}

module.exports.getAwaitingResponsesByJobIdAndName = (jobId, name) => {
    let sql = responsesColumns + `WHERE job_id = $1 AND status NOT IN ('Interview', 'Offer', 'Rejected') AND first_name || ' ' || last_name ILIKE $2;`;
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

module.exports.insertSingleApplication = (jobId, userId, resumeId, proposal) => {
    let sql = `INSERT INTO application (job_id, user_id, resume_id, remarks, fullname, email, phone, proposal)
    SELECT $1, $2, $3, '', first_name || ' ' || last_name, email, phone_number, $4 FROM user_ u JOIN user_detail d ON u.id = d.user_id WHERE u.id = $5
    RETURNING id;`;
    return query(sql, [jobId, userId, resumeId, proposal, userId]).then(function(result) {
        return result.rows;
    });
}