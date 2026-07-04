let jobModel = require("../models/jobModel");
const { query } = require("../services/dbConnection");

// ==================== HELPER FUNCTION ====================

// Check if user owns the company
function checkUserOwnsCompany(userId, companyId) {
    let sql = `SELECT id FROM company_ownership WHERE user_id = $1 AND company_id = $2;`;
    return query(sql, [userId, companyId]).then(function(result) {
        return result.rows;
    });
}

// ==================== JOB CRUD ====================

// CREATE - Post a new job
module.exports.createJob = (req, res, next) => {
    if (!req.body) {
        return res.status(400).json({ error: "Request body is missing" });
    }
    
    let { 
        title, description, category, type, 
        salary_range_from, salary_range_to, salary_type, salary_period,
        duration, deadline, experience, career_level, location, 
        jobs_needed, reports 
    } = req.body;
    
    let companyId = req.body.companyId;
    let userId = req.body.userId || 1;
    
    if (!companyId) {
        return res.status(400).json({ error: "Company ID is required" });
    }
    
    return checkUserOwnsCompany(userId, companyId)
        .then(function(ownership) {
            if (ownership.length === 0) {
                return res.status(403).json({ 
                    error: "Unauthorized: You don't own this company. Only company owners can post jobs." 
                });
            }
            
            if (!title || !description || !category || !type || !salary_range_from || !salary_range_to || !deadline) {
                return res.status(400).json({ 
                    error: "Required fields missing: title, description, category, type, salary_range_from, salary_range_to, deadline" 
                });
            }
            
            if (salary_range_from > salary_range_to) {
                return res.status(400).json({ error: "Minimum salary cannot be greater than maximum salary" });
            }
            
            if (new Date(deadline) < new Date()) {
                return res.status(400).json({ error: "Deadline cannot be in the past" });
            }
            
            return jobModel.createJob({
                title, description, category, type,
                salary_range_from, salary_range_to, salary_type: salary_type || 'Negotiable',
                salary_period: salary_period || 'Month',
                duration, deadline, experience, career_level, location,
                jobs_needed: jobs_needed || 1, reports: reports || 0
            }, companyId)
            .then(function(jobDetails) {
                if (jobDetails.length == 0) {
                    return res.status(400).json({ error: "Failed to create job" });
                }
                res.status(201).json({ message: "Job posted successfully", job: jobDetails[0] });
            });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// READ - Get all jobs with filters
module.exports.getAllJobs = (req, res, next) => {
    let filters = req.query;
    
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 50;
    const offset = (page - 1) * limit;
    filters.limit = limit;
    filters.offset = offset;
    
    Promise.all([
        jobModel.getAllJobs(filters),
        jobModel.getTotalJobCount(filters)
    ]).then(function(results) {
        const jobs = results[0];
        const total = results[1];
        const totalPages = Math.ceil(total / limit);
        
        res.json({
            jobs: jobs,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                totalPages: totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    }).catch(function(error) {
        return res.status(500).json({ error: error.message });
    });
}

// READ - Get recommended jobs
module.exports.getRecommendedJobs = (req, res, next) => {
    let userId = req.query.userId || 1;
    let limit = req.query.limit || 6;
    
    return jobModel.getRecommendedJobs(userId, limit)
        .then(function(jobs) {
            res.json({ count: jobs.length, jobs: jobs });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// READ - Get single job by ID
module.exports.getJobById = (req, res, next) => {
    let jobId = req.params.id;
    let userId = req.query.userId;
    
    return jobModel.getJobById(jobId, userId)
        .then(function(jobDetails) {
            if (jobDetails.length == 0) {
                return res.status(404).json({ error: "Job not found" });
            }
            res.json({ job: jobDetails[0] });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// READ - Get jobs by company
module.exports.getJobsByCompany = (req, res, next) => {
    let companyId = req.params.companyId;
    
    return jobModel.getJobsByCompany(companyId)
        .then(function(jobs) {
            res.json({ count: jobs.length, jobs: jobs });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// READ - Get employer dashboard (NEW)
module.exports.getEmployerDashboard = (req, res, next) => {
    let userId = req.query.userId || 1;
    
    let companySql = `SELECT c.id FROM company c
                      JOIN company_ownership co ON c.id = co.company_id
                      WHERE co.user_id = $1;`;
    
    return query(companySql, [userId])
        .then(function(companyResult) {
            const companyIds = companyResult.rows.map(row => row.id);
            
            if (companyIds.length === 0) {
                return res.json({
                    companies: [],
                    jobs: [],
                    total_jobs: 0,
                    active_jobs: 0,
                    closed_jobs: 0,
                    stats: { total: 0, active: 0, closed: 0 }
                });
            }
            
            let jobSql = `SELECT j.*, c.name as company_name
                         FROM job j
                         JOIN company c ON j.company_id = c.id
                         WHERE j.company_id = ANY($1)
                         ORDER BY j.id DESC;`;
            
            return query(jobSql, [companyIds])
                .then(function(jobResult) {
                    const jobs = jobResult.rows;
                    const total = jobs.length;
                    const active = jobs.filter(j => j.status === 'Active').length;
                    const closed = jobs.filter(j => j.status === 'Closed').length;
                    
                    res.json({
                        companies: companyResult.rows,
                        jobs: jobs,
                        total_jobs: total,
                        active_jobs: active,
                        closed_jobs: closed,
                        stats: { total, active, closed }
                    });
                });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// UPDATE - Edit a job
module.exports.updateJob = (req, res, next) => {
    let jobId = req.params.id;
    let jobData = req.body;
    let companyId = req.body.companyId;
    let userId = req.body.userId || 1;
    
    if (!companyId) {
        return res.status(400).json({ error: "Company ID is required" });
    }
    
    return checkUserOwnsCompany(userId, companyId)
        .then(function(ownership) {
            if (ownership.length === 0) {
                return res.status(403).json({ 
                    error: "Unauthorized: You don't own this company. Only company owners can update jobs." 
                });
            }
            
            return jobModel.checkJobBelongsToCompany(jobId, companyId)
                .then(function(ownership) {
                    if (ownership.length == 0) {
                        return res.status(403).json({ error: "Unauthorized: You don't own this job" });
                    }
                    return jobModel.updateJob(jobId, jobData, companyId)
                        .then(function(updatedJob) {
                            if (updatedJob.length == 0) {
                                return res.status(404).json({ error: "Job not found" });
                            }
                            res.json({ message: "Job updated successfully", job: updatedJob[0] });
                        });
                });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// DELETE - Delete a job
module.exports.deleteJob = (req, res, next) => {
    let jobId = req.params.id;
    let companyId = req.body.companyId;
    let userId = req.body.userId || 1;
    
    if (!companyId) {
        return res.status(400).json({ error: "Company ID is required" });
    }
    
    return checkUserOwnsCompany(userId, companyId)
        .then(function(ownership) {
            if (ownership.length === 0) {
                return res.status(403).json({ 
                    error: "Unauthorized: You don't own this company. Only company owners can delete jobs." 
                });
            }
            
            return jobModel.checkJobBelongsToCompany(jobId, companyId)
                .then(function(ownership) {
                    if (ownership.length == 0) {
                        return res.status(403).json({ error: "Unauthorized: You don't own this job" });
                    }
                    return jobModel.deleteJob(jobId, companyId)
                        .then(function(deletedJob) {
                            if (deletedJob.length == 0) {
                                return res.status(404).json({ error: "Job not found or you don't own it" });
                            }
                            res.json({ message: "Job deleted successfully", deletedId: deletedJob[0].id });
                        });
                });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// UPDATE - Close a job
module.exports.closeJob = (req, res, next) => {
    let jobId = req.params.id;
    let companyId = req.body.companyId;
    let userId = req.body.userId || 1;
    
    if (!companyId) {
        return res.status(400).json({ error: "Company ID is required" });
    }
    
    return checkUserOwnsCompany(userId, companyId)
        .then(function(ownership) {
            if (ownership.length === 0) {
                return res.status(403).json({ 
                    error: "Unauthorized: You don't own this company. Only company owners can close jobs." 
                });
            }
            
            return jobModel.checkJobBelongsToCompany(jobId, companyId)
                .then(function(ownership) {
                    if (ownership.length == 0) {
                        return res.status(403).json({ error: "Unauthorized: You don't own this job" });
                    }
                    return jobModel.updateJobStatus(jobId, 'Closed', companyId)
                        .then(function(closedJob) {
                            if (closedJob.length == 0) {
                                return res.status(404).json({ error: "Job not found or you don't own it" });
                            }
                            res.json({ message: "Job closed successfully", job: closedJob[0] });
                        });
                });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// UPDATE - Open a job (Closed → Active) (NEW)
module.exports.openJob = (req, res, next) => {
    let jobId = req.params.id;
    let companyId = req.body.companyId;
    let userId = req.body.userId || 1;
    
    if (!companyId) {
        return res.status(400).json({ error: "Company ID is required" });
    }
    
    return checkUserOwnsCompany(userId, companyId)
        .then(function(ownership) {
            if (ownership.length === 0) {
                return res.status(403).json({ 
                    error: "Unauthorized: You don't own this company. Only company owners can open jobs." 
                });
            }
            
            return jobModel.checkJobBelongsToCompany(jobId, companyId)
                .then(function(ownership) {
                    if (ownership.length == 0) {
                        return res.status(403).json({ error: "Unauthorized: You don't own this job" });
                    }
                    return jobModel.updateJobStatus(jobId, 'Active', companyId)
                        .then(function(openedJob) {
                            if (openedJob.length == 0) {
                                return res.status(404).json({ error: "Job not found or you don't own it" });
                            }
                            res.json({ message: "Job opened successfully", job: openedJob[0] });
                        });
                });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// ==================== APPLICATIONS ====================

// CREATE - Apply for a job
module.exports.applyForJob = (req, res, next) => {
    let userId = req.body.userId || 1;
    let jobId = req.params.id;
    let resumeId = req.body.resumeId;
    
    if (!resumeId) {
        return res.status(400).json({ error: "Resume ID is required" });
    }
    
    return jobModel.applyForJob(userId, jobId, resumeId)
        .then(function(result) {
            if (result.alreadyApplied) {
                return res.status(400).json({ 
                    error: "Already applied", 
                    status: result.status 
                });
            }
            res.status(201).json({ 
                message: "Application submitted successfully", 
                application: result.application 
            });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// READ - Get my applications
module.exports.getMyApplications = (req, res, next) => {
    let userId = req.query.userId || 1;
    
    return jobModel.getApplicationsByUser(userId)
        .then(function(applications) {
            return jobModel.getApplicationStatusCount(userId).then(function(stats) {
                res.json({ 
                    count: applications.length, 
                    applications: applications,
                    stats: stats
                });
            });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// READ - Get application stats
module.exports.getApplicationStats = (req, res, next) => {
    let userId = req.query.userId || 1;
    
    return jobModel.getApplicationStatusCount(userId)
        .then(function(stats) {
            let total = 0;
            stats.forEach(function(stat) {
                total += parseInt(stat.count);
            });
            res.json({ stats: stats, total: total });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// READ - Get applications by job (for employer)
module.exports.getJobApplications = (req, res, next) => {
    let jobId = req.params.id;
    
    return jobModel.getApplicationsByJob(jobId)
        .then(function(applications) {
            res.json({ count: applications.length, applications: applications });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// UPDATE - Update application status
module.exports.updateApplicationStatus = (req, res, next) => {
    let applicationId = req.params.applicationId;
    let { status, remarks } = req.body;
    
    if (!status) {
        return res.status(400).json({ error: "Status is required" });
    }
    
    return jobModel.updateApplicationStatus(applicationId, status, remarks)
        .then(function(updated) {
            if (updated.length == 0) {
                return res.status(404).json({ error: "Application not found" });
            }
            res.json({ message: "Application status updated", application: updated[0] });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// DELETE - Delete an application
module.exports.deleteApplication = (req, res, next) => {
    let applicationId = req.params.applicationId;
    let userId = req.body.userId || 1;

    let checkSql = `SELECT id FROM application WHERE id = $1 AND user_id = $2;`;
    
    return query(checkSql, [applicationId, userId])
        .then(function(checkResult) {
            if (checkResult.rows.length === 0) {
                return res.status(404).json({ 
                    error: "Application not found or you don't own it" 
                });
            }
            
            let deleteSql = `DELETE FROM application WHERE id = $1 AND user_id = $2 RETURNING id;`;
            return query(deleteSql, [applicationId, userId])
                .then(function(result) {
                    res.json({ 
                        message: "Application deleted successfully", 
                        deletedId: result.rows[0].id 
                    });
                });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// ==================== SAVED JOBS ====================

// CREATE - Save a job
module.exports.saveJob = (req, res, next) => {
    const userId = res.locals.userId;
    let jobId = req.params.id;
    
    return jobModel.saveJob(userId, jobId)
        .then(function(savedJob) {
            if (savedJob.length == 0) {
                return res.status(400).json({ error: "Job already saved or not found" });
            }
            res.status(201).json({ message: "Job saved successfully", saved: savedJob[0] });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}


// DELETE - Unsave a job
module.exports.unsaveJob = (req, res, next) => {
    const userId = res.locals.userId;
    let jobId = req.params.id;
    
    return jobModel.unsaveJob(userId, jobId)
        .then(function(unsavedJob) {
            if (unsavedJob.length == 0) {
                return res.status(404).json({ error: "Job not saved or not found" });
            }
            res.json({ message: "Job unsaved successfully", unsavedId: unsavedJob[0].id });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// READ - Get all saved jobs
module.exports.getSavedJobs = (req, res, next) => {
    const userId = res.locals.userId;
    
    return jobModel.getSavedJobsByUser(userId)
        .then(function(savedJobs) {
            res.json({ count: savedJobs.length, saved_jobs: savedJobs });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// CHECK - Check if job is saved
module.exports.isJobSaved = (req, res, next) => {
    const userId = res.locals.userId;
    let jobId = req.params.id;
    
    return jobModel.isJobSaved(userId, jobId)
        .then(function(result) {
            res.json({ isSaved: result.length > 0 });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// ==================== JOB COMPLETION ====================

// READ - Get completed jobs for a user
module.exports.getCompletedJobs = (req, res, next) => {
    let userId = req.query.userId || 1;
    
    return jobModel.getCompletedJobsByUser(userId)
        .then(function(completedJobs) {
            res.json({ count: completedJobs.length, completed_jobs: completedJobs });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// READ - Get completed jobs for a company
module.exports.getCompanyCompletedJobs = (req, res, next) => {
    let companyId = req.params.companyId;
    
    return jobModel.getCompletedJobsByCompany(companyId)
        .then(function(completedJobs) {
            res.json({ count: completedJobs.length, completed_jobs: completedJobs });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// CHECK - Check if user can review a company
module.exports.canReviewCompany = (req, res, next) => {
    let userId = req.query.userId || 1;
    let companyId = req.params.companyId;
    
    return jobModel.canUserReviewCompany(userId, companyId)
        .then(function(result) {
            res.json(result);
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// ==================== DASHBOARD ====================

// READ - Get job seeker dashboard
module.exports.getJobSeekerDashboard = (req, res, next) => {
    let userId = req.query.userId || 1;
    
    return jobModel.getJobSeekerDashboard(userId)
        .then(function(dashboardData) {
            res.json(dashboardData);
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// ==================== USER RESUME ====================

// READ - Get user's resumes
module.exports.getUserResumes = (req, res, next) => {
    let userId = req.query.userId || 1;
    
    let sql = `SELECT id, file_name, file_data FROM resume WHERE user_id = $1 ORDER BY id DESC;`;
    return require("../services/dbConnection").query(sql, [userId]).then(function(result) {
        let resumes = result.rows.map(function(row) {
            return {
                id: row.id,
                file_name: row.file_name,
                file_data: row.file_data ? row.file_data.toString('base64') : null
            };
        });
        res.json({ count: resumes.length, resumes: resumes });
    }).catch(function(error) {
        return res.status(500).json({ error: error.message });
    });
}