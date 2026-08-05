let jobModel = require("../models/jobModel");
const { query } = require("../services/dbConnection");

// ==================== HELPER FUNCTIONS ====================

// Helper: Get user ID from JWT token (FIXED)
const getUserIdFromReq = (req, res) => {
    return res?.locals?.userId || req.user?.userId || req.user?.id;
};

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
        duration, deadline, experience, career_level, location, address,
        jobs_needed, reports 
    } = req.body;
    let companyId = req.body.companyId;
    const userId = getUserIdFromReq(req, res);
    
    if (!companyId) {
        return res.status(400).json({ error: "Company ID is required" });
    }
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
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
            
            if (parseInt(salary_range_from) > parseInt(salary_range_to) ){
                return res.status(400).json({ error: "Minimum salary cannot be greater than maximum salary" });
            }
            
            if (new Date(deadline) < new Date()) {
                return res.status(400).json({ error: "Deadline cannot be in the past" });
            }
            console.log(req.body)
            return jobModel.createJob({
                title, description, category, type,
                salary_range_from, salary_range_to, salary_type: salary_type || 'Negotiable',
                salary_period: salary_period || 'Month',
                duration, deadline, experience, career_level, location, address,
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
    const limit = parseInt(filters.limit) || 1000;
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
    const userId = getUserIdFromReq(req, res);
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

// READ - Get employer dashboard
module.exports.getEmployerDashboard = (req, res, next) => {
    const userId = getUserIdFromReq(req, res);
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }
    
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
                    deleted_jobs: 0,
                    stats: { total: 0, active: 0, closed: 0, deleted: 0 }
                });
            }
            console.log("done")
            let jobSql = `SELECT j.*, c.name as company_name
                         FROM job j
                         JOIN company c ON j.company_id = c.id
                         WHERE j.company_id = ANY($1) AND j.deleted_at IS NULL
                         ORDER BY j.id DESC;`;
            
            return query(jobSql, [companyIds])
                .then(function(jobResult) {
                    const jobs = jobResult.rows;
                    const total = jobs.length;
                    const active = jobs.filter(j => j.status === 'Active').length;
                    const closed = jobs.filter(j => j.status === 'Closed').length;
                    
                    let deletedSql = `SELECT COUNT(*) as count FROM job WHERE company_id = ANY($1) AND deleted_at IS NOT NULL;`;
                    return query(deletedSql, [companyIds])
                        .then(function(deletedResult) {
                            const deleted = parseInt(deletedResult.rows[0].count);
                            
                            res.json({
                                companies: companyResult.rows,
                                jobs: jobs,
                                total_jobs: total,
                                active_jobs: active,
                                closed_jobs: closed,
                                deleted_jobs: deleted,
                                stats: { total, active, closed, deleted }
                            });
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
    const userId = getUserIdFromReq(req, res);
    
    if (!companyId) {
        return res.status(400).json({ error: "Company ID is required" });
    }
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
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

// ==================== SOFT DELETE & RESTORE ====================

// SOFT DELETE - Soft delete a job (with undo support)
module.exports.softDeleteJob = (req, res, next) => {
    let jobId = req.params.id;
    let companyId = req.body.companyId;
    const userId = getUserIdFromReq(req, res);
    
    console.log('=== softDeleteJob ===');
    console.log('jobId:', jobId);
    console.log('companyId:', companyId);
    console.log('userId from token:', userId);
    
    if (!companyId) {
        return res.status(400).json({ error: "Company ID is required" });
    }
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }
    
    return checkUserOwnsCompany(userId, companyId)
        .then(function(ownership) {
            console.log('Ownership check:', ownership);
            if (ownership.length === 0) {
                return res.status(403).json({ 
                    error: `Unauthorized: User ${userId} doesn't own company ${companyId}` 
                });
            }
            
            return jobModel.checkJobBelongsToCompany(jobId, companyId)
                .then(function(ownership) {
                    console.log('Job ownership:', ownership);
                    if (ownership.length == 0) {
                        return res.status(403).json({ 
                            error: `Unauthorized: Job ${jobId} doesn't belong to company ${companyId}` 
                        });
                    }
                    return jobModel.softDeleteJob(jobId, companyId)
                        .then(function(deletedJob) {
                            if (deletedJob.length == 0) {
                                return res.status(404).json({ error: "Job not found or already deleted" });
                            }
                            res.json({ 
                                message: "Job deleted successfully. You can restore this job using the restore endpoint.", 
                                job: deletedJob[0] 
                            });
                        });
                });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// RESTORE - Restore a soft-deleted job (UNDO DELETION)
module.exports.restoreJob = (req, res, next) => {
    let jobId = req.params.id;
    let companyId = req.body.companyId;
    const userId = getUserIdFromReq(req, res);
    
    console.log('=== restoreJob ===');
    console.log('jobId:', jobId);
    console.log('companyId:', companyId);
    console.log('userId from token:', userId);
    
    if (!companyId) {
        return res.status(400).json({ error: "Company ID is required" });
    }
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }
    
    return checkUserOwnsCompany(userId, companyId)
        .then(function(ownership) {
            if (ownership.length === 0) {
                return res.status(403).json({ 
                    error: `Unauthorized: User ${userId} doesn't own company ${companyId}` 
                });
            }
            
            return jobModel.checkJobBelongsToCompany(jobId, companyId)
                .then(function(ownership) {
                    if (ownership.length == 0) {
                        return res.status(403).json({ 
                            error: `Unauthorized: Job ${jobId} doesn't belong to company ${companyId}` 
                        });
                    }
                    return jobModel.restoreJob(jobId, companyId)
                        .then(function(restoredJob) {
                            if (restoredJob.length == 0) {
                                return res.status(404).json({ error: "Job not found or not deleted" });
                            }
                            res.json({ 
                                message: "Job restored successfully (undo deletion)", 
                                job: restoredJob[0] 
                            });
                        });
                });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// GET DELETED JOBS - Get all deleted jobs for a company
module.exports.getDeletedJobsByCompany = (req, res, next) => {
    let companyId = req.params.companyId;
    const userId = getUserIdFromReq(req, res);
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }
    
    return checkUserOwnsCompany(userId, companyId)
        .then(function(ownership) {
            if (ownership.length === 0) {
                return res.status(403).json({ 
                    error: `Unauthorized: User ${userId} doesn't own company ${companyId}` 
                });
            }
            
            return jobModel.getDeletedJobsByCompany(companyId)
                .then(function(deletedJobs) {
                    res.json({ 
                        count: deletedJobs.length, 
                        deleted_jobs: deletedJobs 
                    });
                });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// GET ALL DELETED JOBS - Get all deleted jobs (admin)
module.exports.getAllDeletedJobs = (req, res, next) => {
    return jobModel.getAllDeletedJobs()
        .then(function(deletedJobs) {
            res.json({ 
                count: deletedJobs.length, 
                deleted_jobs: deletedJobs 
            });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
}

// ==================== OTHER OPERATIONS ====================

// UPDATE - Close a job
module.exports.closeJob = (req, res, next) => {
    let jobId = req.params.id;
    let companyId = req.body.companyId;
    const userId = getUserIdFromReq(req, res);
    
    if (!companyId) {
        return res.status(400).json({ error: "Company ID is required" });
    }
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
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

// UPDATE - Open a job (Closed → Active)
module.exports.openJob = (req, res, next) => {
    let jobId = req.params.id;
    let companyId = req.body.companyId;
    const userId = getUserIdFromReq(req, res);
    
    if (!companyId) {
        return res.status(400).json({ error: "Company ID is required" });
    }
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
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
module.exports.applyForJob = async(req, res, next) => {
    const userId = getUserIdFromReq(req, res);
    let jobId = req.params.id;
    let resumeId = req.body.resumeId;
    const { fullname, email, phone, proposal } = req.body;
    
    if (!userId) {
        return res.status(401).json({
            error: "Unauthorized: User not authenticated"
        });
    }

    let resumeFileName;
    let resumeFileData;

    try {
        // User uploaded a new resume for this application
        if (req.file) {
            resumeFileName = req.file.originalname;
            resumeFileData = req.file.buffer;
            
            return jobModel.applyForJob(
                userId,
                jobId,
                req.body.fullname,
                req.body.email,
                req.body.phone,
                req.body.proposal || '',
                resumeFileName,
                resumeFileData
            ).then(function(application) {
                res.status(201).json({
                    message: "Application submitted successfully",
                    application
                });
            }).catch(function(error) {
                if (error.code === "23505") {
                    return res.status(409).json({
                        error: "You have already applied for this job."
                    });
                }
                res.status(500).json({
                    error: error.message
                });
            });
        }
        // User selected an existing resume
        else if (resumeId) {
            return query(
                `SELECT file_name, file_data
                 FROM resume
                 WHERE id = $1
                 AND user_id = $2`,
                [resumeId, userId]
            ).then(function(result) {
                if (result.rows.length === 0) {
                    return res.status(404).json({
                        error: "Resume not found."
                    });
                }

                resumeFileName = result.rows[0].file_name;
                resumeFileData = result.rows[0].file_data;

                return jobModel.applyForJob(
                    userId,
                    jobId,
                    req.body.fullname,
                    req.body.email,
                    req.body.phone,
                    req.body.proposal || '',
                    resumeFileName,
                    resumeFileData
                );
            }).then(function(application) {
                res.status(201).json({
                    message: "Application submitted successfully",
                    application
                });
            }).catch(function(error) {
                if (error.code === "23505") {
                    return res.status(409).json({
                        error: "You have already applied for this job."
                    });
                }
                res.status(500).json({
                    error: error.message
                });
            });
        }
        // No resume provided
        else {
            return res.status(400).json({
                error: "Resume is required."
            });
        }
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                error: "You have already applied for this job."
            });
        }
        res.status(500).json({
            error: error.message
        });
    }
};

// READ - Get my applications
module.exports.getMyApplications = (req, res, next) => {
    const userId = getUserIdFromReq(req, res);
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }
    
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
    const userId = getUserIdFromReq(req, res);
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }
    
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

// UPDATE - Update application status - FIXED
module.exports.updateApplicationStatus = (req, res, next) => {
    let applicationId = req.params.applicationId;
    let { status, remarks } = req.body;
    
    console.log('=== updateApplicationStatus ===');
    console.log('applicationId:', applicationId);
    console.log('status:', status);
    console.log('remarks:', remarks);
    
    if (!status) {
        return res.status(400).json({ error: "Status is required" });
    }
    
    // Check if application exists first
    let checkSql = `SELECT id, user_id, status FROM application WHERE id = $1;`;
    return query(checkSql, [applicationId])
        .then(function(checkResult) {
            if (checkResult.rows.length === 0) {
                return res.status(404).json({ error: "Application not found" });
            }
            
            console.log('Application found:', checkResult.rows[0]);
            
            // Update the application status
            return jobModel.updateApplicationStatus(applicationId, status, remarks || '');
        })
        .then(function(updated) {
            if (updated.length === 0) {
                return res.status(404).json({ error: "Application not found" });
            }
            res.json({ 
                message: "Application status updated", 
                application: updated[0] 
            });
        })
        .catch(function(error) {
            console.error('Update error:', error);
            return res.status(500).json({ error: error.message });
        });
}

// DELETE - Delete an application
module.exports.deleteApplication = (req, res, next) => {
    let applicationId = req.params.applicationId;
    const userId = getUserIdFromReq(req, res);
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

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

// READ - Get completed jobs for a user - FIXED (removed userId from query)
module.exports.getCompletedJobs = (req, res, next) => {
    const userId = getUserIdFromReq(req, res);
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }
    
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

// CHECK - Check if user can review a company - FIXED (removed userId from query)
module.exports.canReviewCompany = (req, res, next) => {
    const userId = getUserIdFromReq(req, res);
    let companyId = req.params.companyId;
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }
    
    return jobModel.canUserReviewCompany(userId, companyId)
        .then(function(result) {
            res.json(result);
        }).catch(function(error) {
            console.error('canReviewCompany error:', error);
            return res.status(500).json({ error: error.message });
        });
}

// ==================== DASHBOARD ====================

// READ - Get job seeker dashboard
module.exports.getJobSeekerDashboard = (req, res, next) => {
    const userId = getUserIdFromReq(req, res);
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }
    
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
    const userId = getUserIdFromReq(req, res);
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }
    
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