let jobModel = require("../models/jobModel");

// Helper function to get user's first company
function getUserCompany(userId, res, next) {
    return jobModel.getUserCompanies(userId)
        .then(function(companies) {
            if (companies.length == 0) {
                return res.status(400).json({ error: "You don't own any company. Please create a company first." });
            }
            return companies[0];
        });
}

// CREATE - Create a company
module.exports.createCompany = (req, res, next) => {
    let { name, url, contact_email, logo_file_name, logo_file_url, tagline, description, city } = req.body;
    let userId = res.locals.userId;
    
    if (!name || !contact_email) {
        return res.status(400).json({ error: "Company name and contact email are required" });
    }
    
    return jobModel.createCompany({ name, url, contact_email, logo_file_name, logo_file_url, tagline, description, city }, userId)
        .then(function(companyDetails) {
            if (companyDetails.length == 0) {
                return res.status(400).json({ error: "Failed to create company" });
            }
            res.status(201).json({ message: "Company created successfully", company: companyDetails[0] });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// CREATE - Post a new job
module.exports.createJob = (req, res, next) => {
    let { 
        title, description, category, type, status, 
        salary_range_from, salary_range_to, salary_type, salary_period,
        duration, deadline, experience, career_level, location, 
        jobs_needed, reports 
    } = req.body;
    
    let userId = res.locals.userId;
    
    // Validation
    if (!title || !description || !category || !type || !salary_range_from || !salary_range_to || !deadline) {
        return res.status(400).json({ error: "Required fields missing" });
    }
    
    if (salary_range_from > salary_range_to) {
        return res.status(400).json({ error: "Minimum salary cannot be greater than maximum salary" });
    }
    
    if (new Date(deadline) < new Date()) {
        return res.status(400).json({ error: "Deadline cannot be in the past" });
    }
    
    return getUserCompany(userId, res, next)
        .then(function(company) {
            return jobModel.createJob({
                title, description, category, type, status: status || 'Active',
                salary_range_from, salary_range_to, salary_type: salary_type || 'Negotiable',
                salary_period: salary_period || 'Month',
                duration, deadline, experience, career_level, location,
                jobs_needed: jobs_needed || 1, reports: reports || 0
            }, company.id)
            .then(function(jobDetails) {
                if (jobDetails.length == 0) {
                    return res.status(400).json({ error: "Failed to create job" });
                }
                res.status(201).json({ message: "Job posted successfully", job: jobDetails[0] });
            });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// READ - Get all jobs with filters
module.exports.getAllJobs = (req, res, next) => {
    let filters = req.query;
    
    return jobModel.getAllJobs(filters)
        .then(function(jobs) {
            res.json({ count: jobs.length, jobs: jobs });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// READ - Get single job by ID
module.exports.getJobById = (req, res, next) => {
    let jobId = req.params.id;
    
    return jobModel.getJobById(jobId)
        .then(function(jobDetails) {
            if (jobDetails.length == 0) {
                return res.status(404).json({ error: "Job not found" });
            }
            res.json({ job: jobDetails[0] });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// READ - Get my jobs (employer's jobs)
module.exports.getMyJobs = (req, res, next) => {
    let userId = res.locals.userId;
    
    return getUserCompany(userId, res, next)
        .then(function(company) {
            return jobModel.getJobsByCompany(company.id)
                .then(function(jobs) {
                    res.json({ count: jobs.length, jobs: jobs });
                });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// READ - Get my companies
module.exports.getMyCompanies = (req, res, next) => {
    let userId = res.locals.userId;
    
    return jobModel.getUserCompanies(userId)
        .then(function(companies) {
            res.json({ count: companies.length, companies: companies });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// UPDATE - Edit a job
module.exports.updateJob = (req, res, next) => {
    let jobId = req.params.id;
    let userId = res.locals.userId;
    let jobData = req.body;
    
    return getUserCompany(userId, res, next)
        .then(function(company) {
            return jobModel.checkJobBelongsToCompany(jobId, company.id)
                .then(function(ownership) {
                    if (ownership.length == 0) {
                        return res.status(403).json({ error: "Unauthorized: You don't own this job" });
                    }
                    return jobModel.updateJob(jobId, jobData, company.id)
                        .then(function(updatedJob) {
                            if (updatedJob.length == 0) {
                                return res.status(404).json({ error: "Job not found" });
                            }
                            res.json({ message: "Job updated successfully", job: updatedJob[0] });
                        });
                });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// DELETE - Delete a job
module.exports.deleteJob = (req, res, next) => {
    let jobId = req.params.id;
    let userId = res.locals.userId;
    
    return getUserCompany(userId, res, next)
        .then(function(company) {
            return jobModel.deleteJob(jobId, company.id)
                .then(function(deletedJob) {
                    if (deletedJob.length == 0) {
                        return res.status(404).json({ error: "Job not found or you don't own it" });
                    }
                    res.json({ message: "Job deleted successfully", deletedId: deletedJob[0].id });
                });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// UPDATE - Close a job (set status to Closed)
module.exports.closeJob = (req, res, next) => {
    let jobId = req.params.id;
    let userId = res.locals.userId;
    
    return getUserCompany(userId, res, next)
        .then(function(company) {
            return jobModel.updateJobStatus(jobId, 'Closed', company.id)
                .then(function(closedJob) {
                    if (closedJob.length == 0) {
                        return res.status(404).json({ error: "Job not found or you don't own it" });
                    }
                    res.json({ message: "Job closed successfully", job: closedJob[0] });
                });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}