let model = require("../models/memberModel")
module.exports.checkWhetherUserIsInside = (req, res, next) => {
    let username = req.body.username
    return model.getUserByUsername(username)
        .then((userDetails) => {
            if (userDetails.length == 0) {
                model.insertUsers(username)
                    .then((usersInserted) => {
                        res.locals.username = usersInserted[0].username
                        res.locals.userId = usersInserted[0].id
                        res.locals.role = usersInserted[0].role
                        this.insertMoney(req, res, next)
                    }).catch(function (error) {
                        console.error(error);

                        return res.status(500).json({ error: error.message });
                    })
            } else {
                res.locals.username = userDetails[0].username
                res.locals.userId = userDetails[0].id
                res.locals.role = userDetails[0].role
                next()
            }
        }).catch(function (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}
module.exports.insertMoney = (req, res, next) => {
    return model.insertMoney(res.locals.userId)
        .then((detais) => {
            console.log(detais)
            if (detais[0].id) {
                next();
            }
        }).catch(function (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

