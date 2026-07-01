const { query } = require("../services/dbConnection");

// ==================== HELPER FUNCTIONS ====================

// Helper function to normalize category - FIXED for lowercase database values
function normalizeCategory(category) {
    if (!category) return 'other';
    
    const categoryMap = {
        // Lowercase values (your actual database values)
        'admin': 'admin',
        'business': 'business',
        'engineering': 'engineering',
        'customer-support': 'customer-support',
        'customer service': 'customer-support',
        'it': 'it',
        'design': 'design',
        'education': 'education',
        'healthcare': 'healthcare',
        'legal': 'legal',
        'logistics': 'logistics',
        'marketing': 'marketing',
        'sales': 'sales',
        'trades': 'trades',
        'writing': 'writing',
        'other': 'other',
        
        // Map Title Case inputs to lowercase database values
        'IT': 'it',
        'Marketing': 'marketing',
        'Sales': 'sales',
        'Finance': 'finance',
        'HR': 'hr',
        'Operations': 'operations',
        'Customer Service': 'customer-support',
        'Design': 'design',
        'Other': 'other'
    };
    
    return categoryMap[category] || category.toLowerCase();
}

// Helper function to normalize type
function normalizeType(type) {
    if (!type) return 'Full-Time';
    
    const typeMap = {
        'full-time': 'Full-Time',
        'Full-Time': 'Full-Time',
        'full time': 'Full-Time',
        'Full Time': 'Full-Time',
        'part-time': 'Part-Time',
        'Part-Time': 'Part-Time',
        'part time': 'Part-Time',
        'Part Time': 'Part-Time',
        'internship': 'Internship',
        'Internship': 'Internship',
        'contract': 'Contract',
        'Contract': 'Contract',
        'freelance': 'Freelance',
        'Freelance': 'Freelance',
        'temporary': 'Temporary',
        'Temporary': 'Temporary'
    };
    
    return typeMap[type] || type;
}

// Helper function to normalize salary type
function normalizeSalaryType(salaryType) {
    if (!salaryType) return 'Negotiable';
    
    const salaryTypeMap = {
        'negotiable': 'Negotiable',
        'Negotiable': 'Negotiable',
        'fixed': 'Fixed',
        'Fixed': 'Fixed',
        'range': 'Range',
        'Range': 'Range'
    };
    
    return salaryTypeMap[salaryType] || salaryType;
}

// Helper function to normalize salary period
function normalizeSalaryPeriod(salaryPeriod) {
    if (!salaryPeriod) return 'Month';
    
    const salaryPeriodMap = {
        'hour': 'Hour',
        'Hour': 'Hour',
        'month': 'Month',
        'Month': 'Month',
        'year': 'Year',
        'Year': 'Year'
    };
    
    return salaryPeriodMap[salaryPeriod] || salaryPeriod;
}

// Helper function to normalize experience
function normalizeExperience(experience) {
    if (!experience) return '1-3 Years';
    
    const experienceMap = {
        '1-3 years': '1-3 Years',
        '1-3 Years': '1-3 Years',
        '3-5 years': '3-5 Years',
        '3-5 Years': '3-5 Years',
        '5-10 years': '5-10 Years',
        '5-10 Years': '5-10 Years',
        '>10 years': '>10 Years',
        '>10 Years': '>10 Years'
    };
    
    return experienceMap[experience] || experience;
}

// Helper function to normalize duration
function normalizeDuration(duration) {
    if (!duration) return '1-3 days';
    
    const durationMap = {
        '<1 day': '<1 day',
        '1-3 days': '1-3 days',
        '3-7 days': '3-7 days',
        '1 week': '1 week',
        '2-4 weeks': '2-4 weeks',
        '>4 weeks': '>4 weeks'
    };
    
    return durationMap[duration] || duration;
}

// Helper function to normalize career level - FIXED for lowercase database values
function normalizeCareerLevel(careerLevel) {
    if (!careerLevel) return 'entry';
    
    const careerMap = {
        // Lowercase values (your actual database values)
        'entry': 'entry',
        'experienced': 'experienced',
        'leadership': 'leadership',
        'owner': 'owner',
        
        // Map Title Case inputs to lowercase database values
        'Entry': 'entry',
        'Entry Level': 'entry',
        'entry level': 'entry',
        'Experienced': 'experienced',
        'Leadership': 'leadership',
        'Owner': 'owner'
    };
    
    return careerMap[careerLevel] || careerLevel.toLowerCase();
}

// Helper function to normalize location
function normalizeLocation(location) {
    if (!location) return 'Central';
    
    const locationMap = {
        'north': 'North',
        'North': 'North',
        'east': 'East',
        'East': 'East',
        'south': 'South',
        'South': 'South',
        'west': 'West',
        'West': 'West',
        'central': 'Central',
        'Central': 'Central'
    };
    
    return locationMap[location] || location;
}

// Helper function to map country/city to location ENUM
function mapLocationToEnum(location) {
    if (!location) return 'Central';
    
    const locationMap = {
        // Singapore
        'singapore': 'Central',
        'singapore central': 'Central',
        'singapore north': 'North',
        'singapore east': 'East',
        'singapore south': 'South',
        'singapore west': 'West',
        'central': 'Central',
        'east': 'East',
        'north': 'North',
        'south': 'South',
        'west': 'West',
        // Malaysia
        'kuala lumpur': 'Central',
        'penang': 'North',
        'johor bahru': 'South',
        'selangor': 'Central',
        'malacca': 'South',
        // Japan
        'tokyo': 'Central',
        'osaka': 'Central',
        'kyoto': 'Central',
        'nagoya': 'Central',
        'sapporo': 'North',
        // South Korea
        'seoul': 'Central',
        'busan': 'South',
        'incheon': 'Central',
        'daegu': 'South',
        'daejeon': 'Central',
        // USA
        'new york': 'Central',
        'los angeles': 'West',
        'chicago': 'Central',
        'san francisco': 'West',
        'miami': 'South',
        // UK
        'london': 'Central',
        'manchester': 'North',
        'birmingham': 'Central',
        'edinburgh': 'North',
        'glasgow': 'North',
        // Australia
        'sydney': 'East',
        'melbourne': 'South',
        'brisbane': 'East',
        'perth': 'West',
        'adelaide': 'South',
        // China
        'beijing': 'North',
        'shanghai': 'East',
        'guangzhou': 'South',
        'shenzhen': 'South',
        'hong kong': 'East',
        // India
        'mumbai': 'West',
        'delhi': 'North',
        'bangalore': 'South',
        'chennai': 'South',
        'hyderabad': 'South',
        // Germany
        'berlin': 'Central',
        'munich': 'South',
        'frankfurt': 'Central',
        'hamburg': 'North',
        'cologne': 'West',
        // France
        'paris': 'Central',
        'lyon': 'South',
        'marseille': 'South',
        'nice': 'South',
        'toulouse': 'South',
        // Canada
        'toronto': 'East',
        'vancouver': 'West',
        'montreal': 'East',
        'calgary': 'West',
        'ottawa': 'East'
    };
    
    const lowerLoc = location.toLowerCase().trim();
    
    // Check if it's a direct match
    if (locationMap[lowerLoc]) {
        return locationMap[lowerLoc];
    }
    
    // Check if it contains a known city
    for (const [key, value] of Object.entries(locationMap)) {
        if (lowerLoc.includes(key)) {
            return value;
        }
    }
    
    // If no match, return as is
    return normalizeLocation(location);
}

// ==================== JOB CRUD OPERATIONS ====================

// CREATE - Post a new job
module.exports.createJob = function createJob(jobData, companyId) {
    const { 
        title, description, category, type, 
        salary_range_from, salary_range_to, salary_type, salary_period,
        duration, deadline, experience, career_level, location, 
        jobs_needed, reports 
    } = jobData;
    
    // Normalize all values to match database ENUMs
    const normalizedCategory = normalizeCategory(category);
    const normalizedType = normalizeType(type);
    const normalizedSalaryType = normalizeSalaryType(salary_type);
    const normalizedSalaryPeriod = normalizeSalaryPeriod(salary_period);
    const normalizedDuration = normalizeDuration(duration);
    const normalizedExperience = normalizeExperience(experience);
    const normalizedCareerLevel = normalizeCareerLevel(career_level);
    const mappedLocation = mapLocationToEnum(location);
    
    console.log(`Category: "${category}" → "${normalizedCategory}"`);
    console.log(`Type: "${type}" → "${normalizedType}"`);
    console.log(`Salary Type: "${salary_type}" → "${normalizedSalaryType}"`);
    console.log(`Salary Period: "${salary_period}" → "${normalizedSalaryPeriod}"`);
    console.log(`Duration: "${duration}" → "${normalizedDuration}"`);
    console.log(`Experience: "${experience}" → "${normalizedExperience}"`);
    console.log(`Career Level: "${career_level}" → "${normalizedCareerLevel}"`);
    console.log(`Location: "${location}" → "${mappedLocation}"`);
    
    let sql = `INSERT INTO job(
        title, description, category, type, 
        salary_range_from, salary_range_to, salary_type, salary_period,
        duration, deadline, experience, career_level, location, 
        jobs_needed, reports, company_id, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 'Active') 
    RETURNING *;`;
    
    return query(sql, [
        title, description, normalizedCategory, normalizedType,
        salary_range_from, salary_range_to, normalizedSalaryType,
        normalizedSalaryPeriod, normalizedDuration, deadline, normalizedExperience, 
        normalizedCareerLevel, mappedLocation, jobs_needed || 1, reports || 0, companyId
    ]).then(function(result) {
        return result.rows;
    });
}

// READ - Get all jobs with filters
module.exports.getAllJobs = function getAllJobs(filters = {}) {
    let sql = `SELECT j.*, c.name as company_name, c.city as company_city,
               c.logo_file_name, c.tagline as company_tagline,
               (SELECT COUNT(*) FROM saved_job WHERE job_id = j.id) as saved_count,
               (SELECT COUNT(*) FROM application WHERE job_id = j.id) as application_count
               FROM job j 
               JOIN company c ON j.company_id = c.id`;
    let params = [];
    let paramIndex = 1;
    let conditions = [];
    
    // Only show Active jobs by default
    if (!filters.show_all) {
        conditions.push(` j.status = 'Active'`);
    }
    
    // Search filters with normalization
    if (filters.company) {
        conditions.push(` c.name ILIKE $${paramIndex}`);
        params.push(`%${filters.company}%`);
        paramIndex++;
    }
    
    if (filters.category) {
        const normalizedCategory = normalizeCategory(filters.category);
        conditions.push(` j.category = $${paramIndex}`);
        params.push(normalizedCategory);
        paramIndex++;
    }
    
    if (filters.type) {
        const normalizedType = normalizeType(filters.type);
        conditions.push(` j.type = $${paramIndex}`);
        params.push(normalizedType);
        paramIndex++;
    }
    
    if (filters.location) {
        const mappedLocation = mapLocationToEnum(filters.location);
        conditions.push(` j.location = $${paramIndex}`);
        params.push(mappedLocation);
        paramIndex++;
    }
    
    if (filters.experience) {
        const normalizedExperience = normalizeExperience(filters.experience);
        conditions.push(` j.experience = $${paramIndex}`);
        params.push(normalizedExperience);
        paramIndex++;
    }
    
    if (filters.career_level) {
        const normalizedCareerLevel = normalizeCareerLevel(filters.career_level);
        conditions.push(` j.career_level = $${paramIndex}`);
        params.push(normalizedCareerLevel);
        paramIndex++;
    }
    
    if (filters.duration) {
        const normalizedDuration = normalizeDuration(filters.duration);
        conditions.push(` j.duration = $${paramIndex}`);
        params.push(normalizedDuration);
        paramIndex++;
    }
    
    if (filters.min_salary) {
        conditions.push(` j.salary_range_from >= $${paramIndex}`);
        params.push(parseInt(filters.min_salary));
        paramIndex++;
    }
    
    if (filters.max_salary) {
        conditions.push(` j.salary_range_to <= $${paramIndex}`);
        params.push(parseInt(filters.max_salary));
        paramIndex++;
    }
    
    if (filters.search) {
        conditions.push(` (j.title ILIKE $${paramIndex} OR j.description ILIKE $${paramIndex})`);
        params.push(`%${filters.search}%`);
        paramIndex++;
    }
    
    if (filters.company_id) {
        conditions.push(` j.company_id = $${paramIndex}`);
        params.push(parseInt(filters.company_id));
        paramIndex++;
    }
    
    if (conditions.length > 0) {
        sql += " WHERE" + conditions.join(" AND");
    }
    
    // Pagination
    const limit = filters.limit ? parseInt(filters.limit) : 10;
    const offset = filters.offset ? parseInt(filters.offset) : 0;
    sql += ` ORDER BY j.id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    return query(sql, params).then(function(result) {
        return result.rows;
    });
}

// READ - Get total job count for pagination
module.exports.getTotalJobCount = function getTotalJobCount(filters = {}) {
    let sql = `SELECT COUNT(*) as total FROM job j JOIN company c ON j.company_id = c.id`;
    let params = [];
    let paramIndex = 1;
    let conditions = [];
    
    if (!filters.show_all) {
        conditions.push(` j.status = 'Active'`);
    }
    
    if (filters.company) {
        conditions.push(` c.name ILIKE $${paramIndex}`);
        params.push(`%${filters.company}%`);
        paramIndex++;
    }
    
    if (filters.category) {
        const normalizedCategory = normalizeCategory(filters.category);
        conditions.push(` j.category = $${paramIndex}`);
        params.push(normalizedCategory);
        paramIndex++;
    }
    
    if (filters.type) {
        const normalizedType = normalizeType(filters.type);
        conditions.push(` j.type = $${paramIndex}`);
        params.push(normalizedType);
        paramIndex++;
    }
    
    if (filters.location) {
        const mappedLocation = mapLocationToEnum(filters.location);
        conditions.push(` j.location = $${paramIndex}`);
        params.push(mappedLocation);
        paramIndex++;
    }
    
    if (filters.experience) {
        const normalizedExperience = normalizeExperience(filters.experience);
        conditions.push(` j.experience = $${paramIndex}`);
        params.push(normalizedExperience);
        paramIndex++;
    }
    
    if (filters.career_level) {
        const normalizedCareerLevel = normalizeCareerLevel(filters.career_level);
        conditions.push(` j.career_level = $${paramIndex}`);
        params.push(normalizedCareerLevel);
        paramIndex++;
    }
    
    if (filters.duration) {
        const normalizedDuration = normalizeDuration(filters.duration);
        conditions.push(` j.duration = $${paramIndex}`);
        params.push(normalizedDuration);
        paramIndex++;
    }
    
    if (filters.min_salary) {
        conditions.push(` j.salary_range_from >= $${paramIndex}`);
        params.push(parseInt(filters.min_salary));
        paramIndex++;
    }
    
    if (filters.max_salary) {
        conditions.push(` j.salary_range_to <= $${paramIndex}`);
        params.push(parseInt(filters.max_salary));
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
    
    return query(sql, params).then(function(result) {
        return parseInt(result.rows[0].total);
    });
}

// READ - Get recommended jobs based on user history
module.exports.getRecommendedJobs = function getRecommendedJobs(userId, limit = 6) {
    let userHistorySql = `SELECT DISTINCT j.category, j.type 
                          FROM application a 
                          JOIN job j ON a.job_id = j.id 
                          WHERE a.user_id = $1`;
    
    return query(userHistorySql, [userId]).then(function(historyResult) {
        if (historyResult.rows.length === 0) {
            let sql = `SELECT j.*, c.name as company_name, c.city as company_city, c.logo_file_name,
                       (SELECT COUNT(*) FROM saved_job WHERE job_id = j.id) as saved_count
                       FROM job j 
                       JOIN company c ON j.company_id = c.id 
                       WHERE j.status = 'Active'
                       ORDER BY j.id DESC 
                       LIMIT $1`;
            return query(sql, [limit]).then(function(result) {
                return result.rows;
            });
        }
        
        const categories = historyResult.rows.map(row => row.category);
        const types = historyResult.rows.map(row => row.type);
        
        let sql = `SELECT j.*, c.name as company_name, c.city as company_city, c.logo_file_name,
                   (SELECT COUNT(*) FROM saved_job WHERE job_id = j.id) as saved_count
                   FROM job j 
                   JOIN company c ON j.company_id = c.id 
                   WHERE j.status = 'Active' 
                   AND (j.category = ANY($1) OR j.type = ANY($2))
                   ORDER BY j.id DESC 
                   LIMIT $3`;
        
        return query(sql, [categories, types, limit]).then(function(result) {
            return result.rows;
        });
    });
}

// READ - Get single job by ID with full details
module.exports.getJobById = function getJobById(jobId, userId = null) {
    let sql = `SELECT j.*, c.name as company_name, c.city, 
               c.description as company_description, c.contact_email as company_email,
               c.logo_file_name, c.tagline as company_tagline, c.url as company_url,
               (SELECT COUNT(*) FROM application WHERE job_id = j.id) as application_count,
               (SELECT COUNT(*) FROM saved_job WHERE job_id = j.id) as saved_count`;
    
    if (userId) {
        sql += `, (SELECT COUNT(*) FROM saved_job WHERE job_id = j.id AND user_id = $2) as is_saved`;
        sql += `, (SELECT COUNT(*) FROM application WHERE job_id = j.id AND user_id = $2) as has_applied`;
        sql += `, (SELECT status FROM application WHERE job_id = j.id AND user_id = $2 LIMIT 1) as application_status`;
    }
    
    sql += ` FROM job j 
             JOIN company c ON j.company_id = c.id 
             WHERE j.id = $1`;
    
    const params = [jobId];
    if (userId) {
        params.push(userId);
    }
    
    return query(sql, params).then(function(result) {
        return result.rows;
    });
}

// READ - Get jobs by company (WITH DEBUGGING)
module.exports.getJobsByCompany = function getJobsByCompany(companyId) {
    console.log('getJobsByCompany called for company:', companyId);
    
    let sql = `SELECT j.*, 
               (SELECT COUNT(*) FROM application WHERE job_id = j.id) as application_count,
               (SELECT COUNT(*) FROM saved_job WHERE job_id = j.id) as saved_count
               FROM job j 
               WHERE j.company_id = $1 
               ORDER BY j.id DESC;`;
    
    return query(sql, [companyId]).then(function(result) {
        console.log('Jobs returned:', result.rows.length);
        if (result.rows.length > 0) {
            console.log('Job statuses:');
            result.rows.forEach(function(job) {
                console.log('  - ID:', job.id, '| Title:', job.title, '| Status:', job.status);
            });
        } else {
            console.log('No jobs found for company:', companyId);
        }
        return result.rows;
    });
}

// UPDATE - Edit a job
module.exports.updateJob = function updateJob(jobId, jobData, companyId) {
    const { 
        title, description, category, type, 
        salary_range_from, salary_range_to, salary_type, salary_period,
        duration, deadline, experience, career_level, location, 
        jobs_needed, reports 
    } = jobData;
    
    // Normalize values for update
    const normalizedCategory = category ? normalizeCategory(category) : undefined;
    const normalizedType = type ? normalizeType(type) : undefined;
    const normalizedSalaryType = salary_type ? normalizeSalaryType(salary_type) : undefined;
    const normalizedSalaryPeriod = salary_period ? normalizeSalaryPeriod(salary_period) : undefined;
    const normalizedDuration = duration ? normalizeDuration(duration) : undefined;
    const normalizedExperience = experience ? normalizeExperience(experience) : undefined;
    const normalizedCareerLevel = career_level ? normalizeCareerLevel(career_level) : undefined;
    const mappedLocation = location ? mapLocationToEnum(location) : undefined;
    
    let sql = `UPDATE job 
               SET title = COALESCE($1, title),
                   description = COALESCE($2, description),
                   category = COALESCE($3, category),
                   type = COALESCE($4, type),
                   salary_range_from = COALESCE($5, salary_range_from),
                   salary_range_to = COALESCE($6, salary_range_to),
                   salary_type = COALESCE($7, salary_type),
                   salary_period = COALESCE($8, salary_period),
                   duration = COALESCE($9, duration),
                   deadline = COALESCE($10, deadline),
                   experience = COALESCE($11, experience),
                   career_level = COALESCE($12, career_level),
                   location = COALESCE($13, location),
                   jobs_needed = COALESCE($14, jobs_needed),
                   reports = COALESCE($15, reports)
               WHERE id = $16 AND company_id = $17
               RETURNING *;`;
    
    return query(sql, [
        title, description, normalizedCategory, normalizedType,
        salary_range_from, salary_range_to, normalizedSalaryType,
        normalizedSalaryPeriod, normalizedDuration, deadline, normalizedExperience, 
        normalizedCareerLevel, mappedLocation, jobs_needed, reports, jobId, companyId
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
    console.log('checkJobBelongsToCompany:', { jobId, companyId });
    let sql = "SELECT id FROM job WHERE id = $1 AND company_id = $2;";
    return query(sql, [jobId, companyId]).then(function(result) {
        console.log('Check result:', result.rows.length > 0 ? 'Job belongs to company' : 'Job does NOT belong to company');
        return result.rows;
    });
}

// UPDATE - Change job status (WITH DEBUGGING)
module.exports.updateJobStatus = function updateJobStatus(jobId, status, companyId) {
    console.log('updateJobStatus called:', { jobId, status, companyId });
    
    let sql = "UPDATE job SET status = $1 WHERE id = $2 AND company_id = $3 RETURNING *;";
    return query(sql, [status, jobId, companyId]).then(function(result) {
        console.log('Update result:', result.rows.length > 0 ? 'SUCCESS' : 'FAILED');
        if (result.rows.length > 0) {
            console.log('Updated job:', result.rows[0].id, 'New status:', result.rows[0].status);
        }
        return result.rows;
    });
}

// ==================== APPLICATIONS ====================

// CREATE - Apply for a job
module.exports.applyForJob = function applyForJob(userId, jobId, resumeId) {
    let checkSql = `SELECT id, status FROM application WHERE user_id = $1 AND job_id = $2;`;
    return query(checkSql, [userId, jobId]).then(function(checkResult) {
        if (checkResult.rows.length > 0) {
            return { alreadyApplied: true, status: checkResult.rows[0].status };
        }
        
        let sql = `INSERT INTO application (job_id, user_id, resume_id, status, time_applied) 
                   VALUES ($1, $2, $3, 'Reviewing', CURRENT_TIMESTAMP) 
                   RETURNING *;`;
        return query(sql, [jobId, userId, resumeId]).then(function(result) {
            return { alreadyApplied: false, application: result.rows[0] };
        });
    });
}

// READ - Get applications by user with job details
module.exports.getApplicationsByUser = function getApplicationsByUser(userId) {
    let sql = `SELECT a.*, j.title, j.description, j.location, 
               j.salary_range_from, j.salary_range_to, j.type, j.duration,
               c.name as company_name, c.id as company_id, c.logo_file_name,
               c.city as company_city
               FROM application a
               JOIN job j ON a.job_id = j.id
               JOIN company c ON j.company_id = c.id
               WHERE a.user_id = $1
               ORDER BY a.time_applied DESC;`;
    return query(sql, [userId]).then(function(result) {
        return result.rows;
    });
}

// READ - Get applications by job (for employer)
module.exports.getApplicationsByJob = function getApplicationsByJob(jobId) {
    let sql = `SELECT a.*, u.singpass_id as user_identifier,
               ud.first_name, ud.last_name, ud.email
               FROM application a
               JOIN user_ u ON a.user_id = u.id
               LEFT JOIN user_detail ud ON u.id = ud.user_id
               WHERE a.job_id = $1
               ORDER BY a.time_applied DESC;`;
    return query(sql, [jobId]).then(function(result) {
        return result.rows;
    });
}

// READ - Get application status count for a user
module.exports.getApplicationStatusCount = function getApplicationStatusCount(userId) {
    let sql = `SELECT status, COUNT(*) as count 
               FROM application 
               WHERE user_id = $1 
               GROUP BY status;`;
    return query(sql, [userId]).then(function(result) {
        return result.rows;
    });
}

// UPDATE - Update application status
module.exports.updateApplicationStatus = function updateApplicationStatus(applicationId, status, remarks) {
    let sql = `UPDATE application 
               SET status = $1, remarks = COALESCE($2, remarks)
               WHERE id = $3
               RETURNING *;`;
    return query(sql, [status, remarks, applicationId]).then(function(result) {
        return result.rows;
    });
}

// ==================== SAVED JOBS ====================

// CREATE - Save a job
module.exports.saveJob = function saveJob(userId, jobId) {
    let sql = `INSERT INTO saved_job (user_id, job_id) VALUES ($1, $2) RETURNING *;`;
    return query(sql, [userId, jobId]).then(function(result) {
        return result.rows;
    });
}

// DELETE - Unsave a job
module.exports.unsaveJob = function unsaveJob(userId, jobId) {
    let sql = `DELETE FROM saved_job WHERE user_id = $1 AND job_id = $2 RETURNING id;`;
    return query(sql, [userId, jobId]).then(function(result) {
        return result.rows;
    });
}

// READ - Get all saved jobs for a user
module.exports.getSavedJobsByUser = function getSavedJobsByUser(userId) {
    let sql = `SELECT sj.*, j.title, j.description, j.location, 
               j.salary_range_from, j.salary_range_to, j.type, j.duration,
               c.name as company_name, c.id as company_id, c.logo_file_name,
               c.city as company_city
               FROM saved_job sj
               JOIN job j ON sj.job_id = j.id
               JOIN company c ON j.company_id = c.id
               WHERE sj.user_id = $1
               ORDER BY sj.id DESC;`;
    return query(sql, [userId]).then(function(result) {
        return result.rows;
    });
}

// CHECK - Check if a job is saved by user
module.exports.isJobSaved = function isJobSaved(userId, jobId) {
    let sql = `SELECT id FROM saved_job WHERE user_id = $1 AND job_id = $2;`;
    return query(sql, [userId, jobId]).then(function(result) {
        return result.rows;
    });
}

// ==================== JOB COMPLETION ====================

// CHECK - Check if user has completed a job with a company
module.exports.hasUserCompletedJobWithCompany = function hasUserCompletedJobWithCompany(userId, companyId) {
    let sql = `SELECT a.id, a.job_id, a.status 
               FROM application a 
               JOIN job j ON a.job_id = j.id 
               WHERE a.user_id = $1 
               AND j.company_id = $2 
               AND a.status IN ('Offered', 'Onboarded')`;
    return query(sql, [userId, companyId]).then(function(result) {
        return result.rows;
    });
}

// CHECK - Check if user has completed a specific job
module.exports.hasUserCompletedJob = function hasUserCompletedJob(userId, jobId) {
    let sql = `SELECT id, status 
               FROM application 
               WHERE user_id = $1 
               AND job_id = $2 
               AND status IN ('Offered', 'Onboarded')`;
    return query(sql, [userId, jobId]).then(function(result) {
        return result.rows;
    });
}

// READ - Get all completed jobs for a user
module.exports.getCompletedJobsByUser = function getCompletedJobsByUser(userId) {
    let sql = `SELECT a.*, j.title as job_title, j.description, 
               c.name as company_name, c.id as company_id,
               c.logo_file_name
               FROM application a
               JOIN job j ON a.job_id = j.id
               JOIN company c ON j.company_id = c.id
               WHERE a.user_id = $1 
               AND a.status IN ('Offered', 'Onboarded')
               ORDER BY a.time_applied DESC;`;
    return query(sql, [userId]).then(function(result) {
        return result.rows;
    });
}

// READ - Get all completed jobs for a company
module.exports.getCompletedJobsByCompany = function getCompletedJobsByCompany(companyId) {
    let sql = `SELECT a.*, j.title as job_title, 
               u.singpass_id as user_identifier
               FROM application a
               JOIN job j ON a.job_id = j.id
               JOIN user_ u ON a.user_id = u.id
               WHERE j.company_id = $1 
               AND a.status IN ('Offered', 'Onboarded')
               ORDER BY a.time_applied DESC;`;
    return query(sql, [companyId]).then(function(result) {
        return result.rows;
    });
}

// ==================== REVIEW PERMISSIONS ====================

// CHECK - Check if user can review a company
module.exports.canUserReviewCompany = function canUserReviewCompany(userId, companyId) {
    return module.exports.hasUserCompletedJobWithCompany(userId, companyId).then(function(completedJobs) {
        if (completedJobs.length === 0) {
            return { canReview: false, message: "You must complete a job with this company before reviewing." };
        }
        
        let reviewSql = `SELECT id FROM review WHERE user_id = $1 AND company_id = $2;`;
        return query(reviewSql, [userId, companyId]).then(function(reviewResult) {
            if (reviewResult.rows.length > 0) {
                return { canReview: false, message: "You have already reviewed this company." };
            }
            return { canReview: true, message: "You can review this company." };
        });
    });
}

// ==================== DASHBOARD ====================

// READ - Get job seeker dashboard data
module.exports.getJobSeekerDashboard = function getJobSeekerDashboard(userId) {
    return Promise.all([
        module.exports.getApplicationStatusCount(userId),
        module.exports.getApplicationsByUser(userId).then(function(apps) { return apps.slice(0, 5); }),
        module.exports.getSavedJobsByUser(userId).then(function(saved) { return saved.slice(0, 3); }),
        module.exports.getRecommendedJobs(userId, 6)
    ]).then(function(results) {
        let totalApplications = 0;
        results[0].forEach(function(stat) {
            totalApplications += parseInt(stat.count);
        });
        
        return {
            application_stats: results[0],
            total_applications: totalApplications,
            recent_applications: results[1],
            saved_jobs: results[2],
            saved_jobs_count: results[2].length,
            recommended_jobs: results[3]
        };
    });
}