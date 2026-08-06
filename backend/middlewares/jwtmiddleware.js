require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY?.trim() || 'your-secret-key';
const tokenDuration = process.env.JWT_EXPIRES_IN || '4h';
const tokenAlgorithm = process.env.JWT_ALGORITHM || 'HS256';

// Generate JWT Token
module.exports.generateToken = (req, res, next) => {
  const payload = {
    userId: res.locals.userId || req.user?.id,
    username: res.locals.username || req.user?.username,
    timestamp: new Date(),
  };
  console.log("payload: ", payload);

  const options = {
    algorithm: tokenAlgorithm,
    expiresIn: tokenDuration,
  };

  const callback = (err, token) => {
    if (err) {
      console.error("Error jwt:", err);
      res.status(500).json({ error: err.message });
    } else {
      res.locals.token = token;
      next();
    }
  };

  jwt.sign(payload, secretKey, options, callback);
};

// Send Token Response
module.exports.sendToken = (req, res, next) => {
  res.cookie("jwt", res.locals.token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "User logged in successfully",
    token: res.locals.token,
  });
};

// Verify JWT Token Middleware - FIXED
module.exports.verifyToken = (req, res, next) => {
  console.log('=== verifyToken called ===');
  console.log('Authorization header:', req.headers.authorization);
  console.log('Cookies:', req.cookies);
  
  const token =
    req.cookies?.jwt ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.substring(7)
      : null) || (req.query.token ? req.query.token : null);

  console.log('Token extracted:', token ? 'Yes (starts with: ' + token.substring(0, 30) + '...)' : 'No');
  console.log('Token length:', token ? token.length : 0);

  if (!token) {
    console.log('No token provided - returning 401');
    return res.status(401).json({ error: "No token provided" });
  }

  // Check if token has 3 parts (valid JWT format)
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.log('Invalid token format - expected 3 parts, got:', parts.length);
    return res.status(401).json({ 
      error: "Invalid token format",
      details: "Token must have 3 parts separated by dots"
    });
  }

  const callback = (err, decoded) => {
    if (err) {
      console.log('Token verification error:', err.message);
      return res.status(401).json({ 
        error: err.message || "Invalid token",
        details: err.name
      });
    }
    console.log('Token verified successfully for userId:', decoded.userId);
    res.locals.userId = decoded.userId;
    res.locals.tokenTimestamp = decoded.timestamp;
    next();
  };

  try {
    jwt.verify(token, secretKey, callback);
  } catch (error) {
    console.log('JWT verify error:', error.message);
    return res.status(401).json({ 
      error: "Invalid token",
      details: error.message
    });
  }
};

// Get User ID from request (helper function)
module.exports.getUserId = (req) => {
  return res.locals?.userId || req.user?.userId || req.user?.id;
};

// Debug function to test token
module.exports.debugToken = (req, res) => {
  const token =
    req.cookies?.jwt ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.substring(7)
      : null);

  if (!token) {
    return res.status(401).json({ 
      error: "No token provided",
      headers: req.headers,
      cookies: req.cookies
    });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    res.json({
      message: "Token is valid",
      decoded: decoded,
      tokenParts: token.split('.').length,
      tokenLength: token.length
    });
  } catch (error) {
    res.status(401).json({
      error: "Invalid token",
      details: error.message,
      tokenParts: token.split('.').length,
      tokenLength: token.length
    });
  }
};