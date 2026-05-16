const { query } = require("../services/dbConnection");

// CREATE - Post a new job
module.exports.createJob = function createJob(jobData, companyId) {
    const { 
        title, description, category, type, status, 
        salary_range_from, salary_range_to, salary_type, salary_period,
        duration, deadline, experience, career_level, location, 
        jobs_needed, reports 
    } = jobData;
    
    let sql = `INSERT INTO job(
        title, description, category, type, status, 
        salary_range_from, salary_range_to, salary_type, salary_period,
        duration, deadline, experience, career_level, location, 
        jobs_needed, reports, company_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) 
    RETURNING *;`;
    
    return query(sql, [
        title, description, category, type, status || 'Active',
        salary_range_from, salary_range_to, salary_type || 'Negotiable',
        salary_period || 'Month', duration, deadline, experience, 
        career_level, location, jobs_needed || 1, reports || 0, companyId
    ]).then(function(result) {
        return result.rows;
    });
}

// READ - Get all jobs with filters (status filter removed - column doesn't exist)
module.exports.getAllJobs = function getAllJobs(filters = {}) {
    let sql = `SELECT j.*, c.name as company_name, c.city as company_city, c.logo_file_url 
               FROM job j 
               JOIN company c ON j.company_id = c.id`;
    let params = [];
    let paramIndex = 1;
    let conditions = [];
    
    // Status filter removed because column doesn't exist in schema
    // if (filters.status) {
    //     conditions.push(` j.status = $${paramIndex}`);
    //     params.push(filters.status);
    //     paramIndex++;
    // } else {
    //     conditions.push(` j.status = 'Active'`);
    // }
    
    if (filters.category) {
        conditions.push(` j.category = $${paramIndex}`);
        params.push(filters.category);
        paramIndex++;
    }
    
    if (filters.type) {
        conditions.push(` j.type = $${paramIndex}`);
        params.push(filters.type);
        paramIndex++;
    }
    
    if (filters.location) {
        conditions.push(` j.location = $${paramIndex}`);
        params.push(filters.location);
        paramIndex++;
    }
    
    if (filters.experience) {
        conditions.push(` j.experience = $${paramIndex}`);
        params.push(filters.experience);
        paramIndex++;
    }
    
    if (filters.career_level) {
        conditions.push(` j.career_level = $${paramIndex}`);
        params.push(filters.career_level);
        paramIndex++;
    }
    
    if (filters.duration) {
        conditions.push(` j.duration = $${paramIndex}`);
        params.push(filters.duration);
        paramIndex++;
    }
    
    if (filters.min_salary) {
        conditions.push(` j.salary_range_from >= $${paramIndex}`);
        params.push(filters.min_salary);
        paramIndex++;
    }
    
    if (filters.max_salary) {
        conditions.push(` j.salary_range_to <= $${paramIndex}`);
        params.push(filters.max_salary);
        paramIndex++;
    }
    
    if (filters.search) {
        conditions.push(` (j.title ILIKE $${paramIndex} OR j.description ILIKE $${paramIndex})`);
        params.push(`%${filters.search}%`);
        paramIndex++;
    }
    
    if (conditions.length > 0) {
        sql += " WHERE" + conditions.join(" AND");
    }
    
    sql += " ORDER BY j.id DESC";
    
    return query(sql, params).then(function(result) {
        return result.rows;
    });
}

// READ - Get single job by ID
module.exports.getJobById = function getJobById(jobId) {
    let sql = `SELECT j.*, c.name as company_name, c.city, c.logo_file_url, 
               c.description as company_description, c.contact_email as company_email,
               (SELECT COUNT(*) FROM application WHERE job_id = j.id) as application_count 
               FROM job j 
               JOIN company c ON j.company_id = c.id 
               WHERE j.id = $1;`;
    return query(sql, [jobId]).then(function(result) {
        return result.rows;
    });
}

// READ - Get jobs by company (for employer's "My Jobs")
module.exports.getJobsByCompany = function getJobsByCompany(companyId) {
    let sql = `SELECT j.*, 
               (SELECT COUNT(*) FROM application WHERE job_id = j.id) as application_count 
               FROM job j 
               WHERE j.company_id = $1 
               ORDER BY j.id DESC;`;
    return query(sql, [companyId]).then(function(result) {
        return result.rows;
    });
}

// READ - Get all companies owned by user
module.exports.getUserCompanies = function getUserCompanies(userId) {
    let sql = `SELECT c.* 
               FROM company c 
               JOIN company_ownership co ON c.id = co.company_id 
               WHERE co.user_id = $1;`;
    return query(sql, [userId]).then(function(result) {
        return result.rows;
    });
}

// READ - Get single company by ID
module.exports.getCompanyById = function getCompanyById(companyId) {
    let sql = "SELECT * FROM company WHERE id = $1;";
    return query(sql, [companyId]).then(function(result) {
        return result.rows;
    });
}

// CREATE - Create a company
module.exports.createCompany = function createCompany(companyData, userId) {
    const { name, url, contact_email, logo_file_name, logo_file_url, tagline, description, city } = companyData;
    
    let sql = `INSERT INTO company(name, url, contact_email, logo_file_name, logo_file_url, tagline, description, city) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
               RETURNING *;`;
    
    return query(sql, [name, url, contact_email, logo_file_name, logo_file_url, tagline, description, city])
        .then(function(result) {
            let company = result.rows[0];
            let sql2 = "INSERT INTO company_ownership(user_id, company_id) VALUES ($1, $2) RETURNING *;";
            return query(sql2, [userId, company.id]).then(function() {
                return [company];
            });
        });
}

// UPDATE - Edit a job
module.exports.updateJob = function updateJob(jobId, jobData, companyId) {
    const { 
        title, description, category, type, status, 
        salary_range_from, salary_range_to, salary_type, salary_period,
        duration, deadline, experience, career_level, location, 
        jobs_needed, reports 
    } = jobData;
    
    let sql = `UPDATE job 
               SET title = COALESCE($1, title),
                   description = COALESCE($2, description),
                   category = COALESCE($3, category),
                   type = COALESCE($4, type),
                   status = COALESCE($5, status),
                   salary_range_from = COALESCE($6, salary_range_from),
                   salary_range_to = COALESCE($7, salary_range_to),
                   salary_type = COALESCE($8, salary_type),
                   salary_period = COALESCE($9, salary_period),
                   duration = COALESCE($10, duration),
                   deadline = COALESCE($11, deadline),
                   experience = COALESCE($12, experience),
                   career_level = COALESCE($13, career_level),
                   location = COALESCE($14, location),
                   jobs_needed = COALESCE($15, jobs_needed),
                   reports = COALESCE($16, reports)
               WHERE id = $17 AND company_id = $18
               RETURNING *;`;
    
    return query(sql, [
        title, description, category, type, status,
        salary_range_from, salary_range_to, salary_type, salary_period,
        duration, deadline, experience, career_level, location,
        jobs_needed, reports, jobId, companyId
    ]).then(function(result) {
        return result.rows;
    });
}

// DELETE - Delete a job
module.exports.deleteJob = function deleteJob(jobId, companyId) {
    let sql = "DELETE FROM job WHERE id = $1 AND company_id = $2 RETURNING id;";
    return query(sql, [jobId, companyId]).then(function(result) {
        return result.rows;
    });
}

// CHECK - Verify job belongs to company
module.exports.checkJobBelongsToCompany = function checkJobBelongsToCompany(jobId, companyId) {
    let sql = "SELECT id FROM job WHERE id = $1 AND company_id = $2;";
    return query(sql, [jobId, companyId]).then(function(result) {
        return result.rows;
    });
}

// UPDATE - Change job status (Active, Closed, Reviewing)
module.exports.updateJobStatus = function updateJobStatus(jobId, status, companyId) {
    let sql = "UPDATE job SET status = $1 WHERE id = $2 AND company_id = $3 RETURNING *;";
    return query(sql, [status, jobId, companyId]).then(function(result) {
        return result.rows;
    });
}