const { auth } = require('../config/firebase');

module.exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }
    
    return auth.verifyIdToken(token)
        .then(function(decodedToken) {
            req.user = decodedToken;
            req.userId = decodedToken.uid;
            next();
        }).catch(function(error) {
            console.error(error);
            return res.status(401).json({ error: "Invalid or expired token" });
        });
}