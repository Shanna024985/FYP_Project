let model = require("../models/applicationModel");
let jobModel = require("../models/jobModel");

// APPLICANT OVERVIEW
// verify job ID
module.exports.verifyJobId = (req, res, next) => {
    if (!req.body.jobId) {
        return res.status(400).json({ message: 'jobId is undefined' });
    } else {
        next();
    }
}

// verify job exists (and user owns the job)
module.exports.verifyJobOwnership = (req, res, next) => {
    return jobModel.getJobById(req.body.jobId)
    .then((job) => {
        if (job.length == 0) {
            return res.status(404).json({ message: 'jobId is not found' });
        } else if (job[0].user_id != res.locals.userId) {
            return res.status(403).json({ message: 'You are not the owner of this job' });
        } else {
            res.locals.responses = result.application_count;
            next();
        }
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

// get responses by stage
module.exports.getResponseDetailsByStage = (req, res, next) => {
    return model.getResponseDetailsByStage(req.body.jobId)
    .then((result) => {
        res.locals.responseDetails = result[0];
        next();
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

// get responses by job ID
module.exports.getResponsesById = (req, res, next) => {
    return model.getResponsesById(req.body.jobId)
    .then((applications) => {
        return res.status(200).json({responses: res.locals.responses, responseDetails: res.locals.responseDetails, applications});
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}