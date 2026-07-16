let model = require("../models/messageModel");
let userModel = require("../models/userModel");

module.exports.getMessageWithUserByUserId = (req, res, next) => {
    if (req.body.userId == undefined) {
        return res.status(400).json({ message: 'userId is undefined' });
    } else if (req.body.page == undefined) {
        req.body.page = 1;
    } else if (typeof req.body.page != 'number' || !Number.isInteger(req.body.page)) {
        return res.status(400).json({ message: 'page is not an integer' });
    } else if (req.body.page <= 0) {
        return res.status(400).json({ message: 'page cannot be 0 or less' });
    }

    return model.getMessageBetweenUsers(res.locals.userId, req.body.userId, req.body.page)
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

module.exports.checkMessageExists = (req, res, next) => {
    return model.getMessageById(req.params.id)
    .then((messages) => {
        if (messages.length == 0) {
            return res.status(404).json({message: 'message not found'});
        } else if (messages[0].sender_user_id != res.locals.userId) {
            return res.status(403).json({message: 'You did not send this message'});
        } else {
            next();
        }
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

module.exports.deleteMessageById = (req, res, next) => {
    return model.deleteMessageById(req.params.id)
    .then((messages) => {
        model.sendUpdateMessage(messages[0].receiver_user_id, res.locals.userId);
        return res.status(200).json({message: 'message deleted successfully'});
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

module.exports.updateMessageById = (req, res, next) => {
    if (req.body.message == undefined) {
        return res.status(400).json({message: 'message is undefined'});
    }

    return model.updateMessageById(req.body.message, req.params.id)
    .then((messages) => {
        model.sendUpdateMessage(messages[0].receiver_user_id, res.locals.userId);
        return res.status(200).json({message: 'message deleted successfully'});
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

module.exports.checkReceiverUserIdExists = (req, res, next) => {
    if (req.body.receiverUserId == undefined) {
        return res.status(400).json({message: 'receiverUserId is undefined'});
    }

    return userModel.getUserDetailById(req.body.receiverUserId)
    .then((user) => {
        if (user.length == 0) {
            return res.status(404).json({message: 'receiverUserId not found'});
        } else if (user[0].id == res.locals.userId) {
            return res.status(403).json({message: 'You cannot message yourself'});
        } else {
            next();
        }
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

module.exports.createMessage = (req, res, next) => {
    if (req.body.message == undefined) {
        return res.status(400).json({message: 'message is undefined'});
    }

    return model.insertSingleMessage(res.locals.userId, req.body.receiverUserId, req.body.message)
    .then((messages) => {
        model.sendUpdateMessage(req.body.receiverUserId, res.locals.userId);
        return res.status(200).json({message: 'message created successfully', id: messages[0].id});
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}