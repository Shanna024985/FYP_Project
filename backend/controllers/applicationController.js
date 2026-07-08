let model = require("../models/applicationModel");
let jobModel = require("../models/jobModel");
let resumeModel = require("../models/resumeModel");

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
            res.locals.responses = parseInt(userIds[0].application_count);
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
        } else if (!userIds.map(a => a.user_id).includes(res.locals.userId)) {
            return res.status(403).json({ message: 'You are not the owner of this job' });
        } else {
            res.locals.jobId = req.params.jobId;
            next();
        }
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

// get responses by stage
module.exports.getResponseDetailsByStage = (req, res, next) => {
    return model.getResponseDetailsByStage(res.locals.jobId)
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
    return model.getActiveCandidatesByJobId(res.locals.jobId)
    .then((applications) => {
        if (res.locals.responseDetails) {
            // format is this for now
            const responseDetails = [
                {month: "Screening", desktop: res.locals.responseDetails.screening},
                {month: "Test", desktop: res.locals.responseDetails.testing},
                {month: "Interview", desktop: res.locals.responseDetails.interviewing},
                {month: "Offer", desktop: res.locals.responseDetails.offered},
                {month: "Onboard", desktop: res.locals.responseDetails.onboarded}
            ]

            // return res.status(200).json({responses: res.locals.responses, responseDetails: res.locals.responseDetails, activeCandidates: applications});
            return res.status(200).json({responses: res.locals.responses, responseDetails, activeCandidates: applications});
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
    return model.getApplicationsByJobId(res.locals.jobId)
    .then((applications) => {
        return res.status(200).json(applications);
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

// get responses awaiting action by job ID
module.exports.getAwaitingResponsesByJobId = (req, res, next) => {
    return model.getAwaitingResponsesByJobId(req.params.jobId)
    .then((applications) => {
        return res.status(200).json(applications);
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

// get active candidates by job ID
module.exports.getActiveCandidatesByJobIdAndName = (req, res, next) => {
    return model.getActiveCandidatesByJobIdAndName(res.locals.jobId, req.params.name)
    .then((applications) => {
        return res.status(200).json(applications);
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

// get responses awaiting action by job ID
module.exports.getAwaitingResponsesByJobIdAndName = (req, res, next) => {
    return model.getAwaitingResponsesByJobIdAndName(res.locals.jobId, req.params.name)
    .then((applications) => {
        return res.status(200).json(applications);
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

// get job ID by application ID
module.exports.getJobIdByApplicationId = (req, res, next) => {
    return model.getJobIdByApplicationId(req.params.id)
    .then((jobId) => {
        if (jobId.length == 0) {
            return res.status(404).json({ message: 'id is not found' });
        } else {
            req.params.jobId = jobId[0].job_id
            next();
        }
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

// update status by ID
module.exports.updateStatusById = (req, res, next) => {
    return model.updateStatusById(req.body.status, req.params.id)
    .then((applications) => {
        return res.status(200).json(applications);
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

// verify that provided status exists
module.exports.verifyStatus = (req, res, next) => {
    if (!req.body.status) {
        return res.status(400).json({ message: 'status is undefined' });
    } else if (!['Reviewing', 'Screening', 'Testing', 'Interviewing', 'Offered', 'Onboarded', 'Rejected'].includes(req.body.status)) {
        return res.status(400).json({ message: 'status is not one of the following: Reviewing, Screening, Testing, Interviewing, Offered, Onboarded, Rejected' });
    } else {
        next();
    }
}

// create an application
module.exports.createApplication = (req, res, next) => {
    return model.insertSingleApplication(req.params.id, res.locals.userId, req.body.resumeId)
    .then((application) => {
        return res.status(201).json({ message: 'Successfully applied for job.', id: application[0].id});
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}