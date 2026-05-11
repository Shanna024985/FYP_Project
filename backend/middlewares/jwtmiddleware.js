require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY.trim();
const tokenDuration = process.env.JWT_EXPIRES_IN;
const tokenAlgorithm = process.env.JWT_ALGORITHM;
module.exports.generateToken = (req, res, next) => {
  const payload = {
    userId: res.locals.userId,      // traditional login/register
      username: res.locals.username,              // google login
    timestamp: new Date(),
    role: res.locals.role
  } // payload is for the user id and timestamp
  console.log("payload: ", payload)
  const options = {
    algorithm: tokenAlgorithm,
    expiresIn: tokenDuration,
  }; //

  const callback = (err, token) => {
    if (err) {
      console.error("Error jwt:", err);
      res.status(500).json(err);
    } else {
      res.locals.token = token;
      next();
    }
  }; // callback is to run the next function

  const token = jwt.sign(payload, secretKey, options, callback);
};

module.exports.sendToken = (req, res, next) => {
  // Set JWT cookie
  
  res.cookie("jwt", res.locals.token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000
  });

  return res.status(200).json({
    message: "User logged in successfully",
    token: res.locals.token,
  });
};
module.exports.verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   // console.log("Loaded Secret Key", process.env.JWT_SECRET_KEY)
//   if (!authHeader || !authHeader.startsWith('Bearer ')) { // a bearer token must be sent, it holds the checks.  
//     return res.status(401).json({ error: 'No token provided' });
//   } //

//  const token =
//     req.cookies?.jwt ||
//     (req.headers.authorization?.startsWith("Bearer ")
//         ? req.headers.authorization.substring(7)
//         : null);

//   if (!token) {
//     return res.status(401).json({ error: "No token provided" });
//   }

//   const callback = (err, decoded) => {
//     if (err) {
//       return res.status(401).json(err);
//     }
//     res.locals.userId = decoded.userId;
//     res.locals.tokenTimestamp = decoded.timestamp;

//     next();
//   };

//   jwt.verify(token, secretKey, callback);

  // Take token from cookie OR Authorization header
  const token =
    req.cookies?.jwt ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.substring(7)
      : null);

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  const callback = (err, decoded) => {
    if (err) {
      return res.status(401).json(err);
    }
    res.locals.userId = decoded.userId;
    res.locals.tokenTimestamp = decoded.timestamp;
    next();
  };

  jwt.verify(token, secretKey, callback);
};
