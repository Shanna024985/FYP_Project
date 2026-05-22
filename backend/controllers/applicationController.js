let model = require("../models/applicationModel");
let jobModel = require("../models/jobModel");

// APPLICANT OVERVIEW
// verify job ID
module.exports.verifyJobId = (req, res, next) => {
    if (!req.params.jobId) {
        return res.status(400).json({ message: 'jobId is undefined' });
    } else {
        next();
    }
}

// verify job exists
module.exports.verifyJobExists = (req, res, next) => {
    return jobModel.getJobById(req.params.jobId)
    .then((userIds) => {
        if (userIds.length == 0) {
            return res.status(404).json({ message: 'jobId is not found' });
        } else {
            res.locals.responses = result.application_count;
            next();
        }
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

// verify user owns the job
module.exports.verifyJobOwnership = (req, res, next) => {
    return model.getJobCompanyOwnershipById(req.params.jobId)
    .then((userIds) => {
        if (userIds.length == 0) {
            return res.status(403).json({ message: 'No users are connected to this job' });
        } else if (userIds.map(a => a.user_id).includes(res.locals.userId)) {
            return res.status(403).json({ message: 'You are not the owner of this job' });
        } else {
            next();
        }
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

// get responses by stage
module.exports.getResponseDetailsByStage = (req, res, next) => {
    return model.getResponseDetailsByStage(req.params.jobId)
    .then((result) => {
        res.locals.responseDetails = result[0];
        next();
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

// get active candidates by job ID
module.exports.getActiveCandidatesByJobId = (req, res, next) => {
    return model.getActiveCandidatesById(req.params.jobId)
    .then((applications) => {
        if (res.locals.responseDetails) {
            return res.status(200).json({responses: res.locals.responses, responseDetails: res.locals.responseDetails, activeCandidates: applications});
        } else {
            return res.status(200).json(applications);
        }
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

// get responses by job ID
module.exports.getResponsesByJobId = (req, res, next) => {
    return model.getApplicationsById(req.params.jobId)
    .then((applications) => {
        return res.status(200).json(applications);
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

// get responses awaiting action by job ID
module.exports.getAwaitingResponsesByJobId = (req, res, next) => {
    return model.getAwaitingResponsesById(req.params.jobId)
    .then((applications) => {
        return res.status(200).json(applications);
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

// get active candidates by job ID
module.exports.getActiveCandidatesByJobIdAndName = (req, res, next) => {
    return model.getActiveCandidatesByIdAndName(req.params.jobId, req.params.name)
    .then((applications) => {
        return res.status(200).json(applications);
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

// get responses awaiting action by job ID
module.exports.getAwaitingResponsesByJobIdAndName = (req, res, next) => {
    return model.getAwaitingResponsesByIdAndName(req.params.jobId, req.params.name)
    .then((applications) => {
        return res.status(200).json(applications);
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}