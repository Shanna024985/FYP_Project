let model = require("../models/messageModel");

module.exports.getMessageWithUserByUserId = (req, res, next) => {
    if (req.body.userId == undefined) {
        return res.status(400).json({ message: 'userId is undefined' });
    }

    return model.getMessageBetweenUsers(res.locals.userId, req.body.userId)
    .then((messages) => {
        return res.status(200).json(messages);
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

module.exports.getUserList = (req, res, next) => {
    return model.getUserList(res.locals.userId)
    .then((messages) => {
        return res.status(200).json(messages);
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}