let model = require("../models/resumeModel");

// verify provided resume exists
module.exports.verifyResumeExists = (req, res, next) => {
    if (!req.body.resumeId) {
        return res.status(400).json({ message: 'resumeId is undefined' });
    } else {
        next();
    }
}

// verify user owns the provided resume
module.exports.verifyResumeOwnership = (req, res, next) => {
    return resumeModel.getResumeById(req.body.resumeId)
    .then((resume) => {
        if (resume.length == 0) {
            return res.status(404).json({ message: 'resumeId is not found' });
        } else if (resume[0].user_id != res.locals.userId) {
            return res.status(403).json({ message: 'You are not the owner of this resume' });
        } else {
            next();
        }
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

// Create a resume
// module.exports.createResume = (req, res, next) => {
//     return model.insertSingleResume(res.locals.userId, res.locals.resumeName, res.locals.resumeURL)
//         .then(function(resume) {
//             return res.status(201).json({ message: 'Successfully created resume.', id: resume[0].id});
//         });
// }

module.exports.createResume = (req, res, next) => {
    if (!req.body.resumeFile) {
        return res.status(400).json({ message: 'resumeFile is undefined'});
    }

    return model.insertSingleResume(res.locals.userId, req.body.resumeFile.name, req.body.resumeFile.bytes())
    .then(function(resume) {
        return res.status(201).json({ message: 'Successfully created resume.', id: resume[0].id});
    });
}

// Set default resume
module.exports.setDefaultResume = (req, res, next) => {
    return model.updateDefaultResume(req.body.resumeId, res.locals.userId)
    .then(function(resume) {
        return res.status(200).json({ message: 'Successfully updated resume.'});
    });
}