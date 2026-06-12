let jobModel = require("../models/jobModel");

// CREATE - Post a new job
module.exports.createJob = (req, res, next) => {
    let { 
        title, description, category, type, 
        salary_range_from, salary_range_to, salary_type, salary_period,
        duration, deadline, experience, career_level, location, 
        jobs_needed, reports 
    } = req.body;
    
    let companyId = req.body.companyId;
    
    if (!companyId) {
        return res.status(400).json({ error: "Company ID is required" });
    }
    
    if (!title || !description || !category || !type || !salary_range_from || !salary_range_to || !deadline) {
        return res.status(400).json({ error: "Required fields missing" });
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

// READ - Get jobs by company
module.exports.getJobsByCompany = (req, res, next) => {
    let companyId = req.params.companyId;
    
    return jobModel.getJobsByCompany(companyId)
        .then(function(jobs) {
            res.json({ count: jobs.length, jobs: jobs });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// UPDATE - Edit a job
module.exports.updateJob = (req, res, next) => {
    let jobId = req.params.id;
    let jobData = req.body;
    
    let companyId = req.body.companyId;
    
    if (!companyId) {
        return res.status(400).json({ error: "Company ID is required" });
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
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// DELETE - Delete a job
module.exports.deleteJob = (req, res, next) => {
    let jobId = req.params.id;
    let companyId = req.body.companyId;
    
    if (!companyId) {
        return res.status(400).json({ error: "Company ID is required" });
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
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// UPDATE - Close a job (set status to Closed) - ADD THIS FUNCTION
module.exports.closeJob = (req, res, next) => {
    let jobId = req.params.id;
    let companyId = req.body.companyId;
    
    if (!companyId) {
        return res.status(400).json({ error: "Company ID is required" });
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
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}