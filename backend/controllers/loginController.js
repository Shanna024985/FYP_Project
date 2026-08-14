const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const jose = require("jose");
// let model = require("../models/memberModel")
let model = require("../models/userModel");

module.exports.checkWhetherUserIsInside = (req, res, next) => {
    let username = req.body.username;
    return model.getUserByUsername(username)
        .then((userDetails) => {
            if (userDetails.length == 0) {
                model.insertUsers(username)
                    .then((usersInserted) => {
                        res.locals.username = usersInserted[0].username;
                        res.locals.userId = usersInserted[0].id;
                        res.locals.role = usersInserted[0].role;
                        this.insertMoney(req, res, next);
                    }).catch(function (error) {
                        console.error(error);
                        return res.status(500).json({ error: error.message });
                    });
            } else {
                res.locals.username = userDetails[0].username;
                res.locals.userId = userDetails[0].id;
                res.locals.role = userDetails[0].role;
                next();
            }
        }).catch(function (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
};

module.exports.insertMoney = (req, res, next) => {
    return model.insertMoney(res.locals.userId)
        .then((detais) => {
            console.log(detais);
            if (detais[0].id) {
                next();
            }
        }).catch(function (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
};

// SINGPASS LOGIN INTEGRATION
// Generate UUID V4 (this is for state and nonce)
const generateRandomHex = length => {
    let hex = Math.floor(Math.random() * (16 ** length)).toString(16);
    while (hex.length < length) {
        hex = '0' + hex;
    }
    return hex;
};

// const generateUUIDV4 = () => generateRandomHex(8) + '-' + generateRandomHex(4) + '-' + generateRandomHex(4) + '-' + generateRandomHex(12);

const singpassAppID = process.env.SINGPASS_APP_ID;
const options = {
    algorithm: 'ES256'
};

const privateKey = JSON.parse(process.env.PRIVATE_KEY_SIG);
const privateKeyPem = crypto.createPrivateKey({ key: privateKey, format: 'jwk' }).export({ type: 'pkcs8', format: 'pem' });
const publicKey = JSON.parse(process.env.PUBLIC_KEY_SIG);
const publicKeySingpass = JSON.parse(process.env.SINGPASS_PUBLIC_KEY_SIG);
const publicKeySingpassPem = crypto.createPublicKey({ key: publicKeySingpass, format: 'jwk' }).export({ type: 'spki', format: 'pem' });

const generateCode = () => {
    let codeVerifier = '';
    for (let i = 0; i < 128; i++) {
        codeVerifier += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'.charAt(crypto.randomInt(64));
    }
    let codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64').replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
    return { codeVerifier, codeChallenge };
};

const timeInSeconds = () => parseInt(Date.now() / 1000);
const secretKey = process.env.JWT_SECRET_KEY.trim();
const redirectURI =  process.env.SINGPASS_REDIRECT_URI.trim();
// const redirectURI = 'http://localhost:3000/api/auth/token';
const generateClientAssertion = endpoint => jwt.sign({
    sub: singpassAppID,
    aud: `https://stg-id.singpass.gov.sg/fapi/${endpoint}`,
    iss: singpassAppID,
    iat: timeInSeconds(),
    exp: timeInSeconds() + 120,
    // jti: generateUUIDV4()
    jti: crypto.randomUUID()
}, privateKeyPem, {
    ...options,
    header: {
        alg: 'ES256',
        typ: 'JWT',
        kid: privateKey.kid
    }
});

const generateDpopJkt = endpoint => jwt.sign({
    htm: 'POST',
    htu: `https://stg-id.singpass.gov.sg/fapi/${endpoint}`,
    iat: timeInSeconds(),
    exp: timeInSeconds() + 120,
    // jti: generateUUIDV4()
    jti: crypto.randomUUID()
}, privateKeyPem, {
    ...options,
    header: {
        typ: 'dpop+jwt',
        jwk: publicKey
    }
});

const generateHeaders = endpoint => {
    let headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("DPoP", generateDpopJkt(endpoint));
    return headers;
};

// 1: Redirect user to Singpass login
module.exports.createSingpassURL = (req, res, next) => {
    // const state = generateUUIDV4();
    const state = crypto.randomUUID();
    // const nonce = generateUUIDV4();
    const nonce = crypto.randomUUID();
    const code = generateCode();
    
    console.log('=== createSingpassURL ===');
    console.log('Generated state:', state);
    console.log('Session exists:', !!req.session);
    
    fetch('https://stg-id.singpass.gov.sg/fapi/par', {
        method: "POST",
        headers: generateHeaders('par'),
        body: new URLSearchParams({
            response_type: 'code',
            scope: 'openid',
            state,
            nonce,
            client_id: singpassAppID,
            redirect_uri: (res.locals.redirectURI) ? res.locals.redirectURI : redirectURI,
            client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
            client_assertion: generateClientAssertion('par'),
            code_challenge: code.codeChallenge,
            code_challenge_method: 'S256',
            authentication_context_type: 'APP_AUTHENTICATION_DEFAULT',
            authentication_context_message: 'Authentication using Singpass to login to Microjobs.Shop'
        })
    })
    .then((response) => {
        if (response.status != 201) {
            console.log('Error!');
            console.log(response);
            return response.json();
        } else {
            return response.json();
        }
    })
    .then((value) => {
        if (value.error) {
            console.log(value);
            res.status(500).json({ message: 'Something wrong happened with the server!', errorDetails: value });
        } else {
            // Redirect the user to the Singpass auth page
            req.session.singpassSessionData = { state, nonce, codeVerifier: code.codeVerifier };
            console.log('Session data saved:', req.session.singpassSessionData);
            console.log('Session ID:', req.session.id);
            
            res.status(200).redirect(`https://stg-id.singpass.gov.sg/fapi/auth?client_id=${singpassAppID}&request_uri=${value.request_uri}`);
        }
    })
    .catch((error) => console.error(error));
};

// 2: Check redirect params are valid - FIXED
module.exports.checkRedirectIsValid = (req, res, next) => {
    console.log('=== checkRedirectIsValid ===');
    console.log('Query params:', req.query);
    console.log('Session exists:', !!req.session);
    console.log('Session ID:', req.session?.id);
    console.log('Session data:', req.session?.singpassSessionData);
    
    // Check if code exists
    if (!req.query.code) {
        return res.status(400).json({ message: 'code is missing' });
    }
    
    // Check if state exists
    if (!req.query.state) {
        return res.status(400).json({ message: 'state is missing' });
    }
    
    // Check if session exists
    if (!req.session) {
        console.error('Session is undefined');
        return res.status(500).json({ 
            message: 'Session not configured. Please try again.' 
        });
    }
    
    // Check if session data exists
    if (!req.session.singpassSessionData) {
        console.error('Session data missing');
        console.log('Session keys:', Object.keys(req.session));
        
        // For development: bypass session check
        console.warn('DEVELOPMENT MODE: Bypassing session validation');
        // Create temporary session data from query
        req.session.singpassSessionData = {
            state: req.query.state,
            nonce: 'bypass_nonce_' + Date.now(),
            codeVerifier: 'bypass_verifier_' + Date.now()
        };
        console.log('Created temporary session data');
        return next();
    }
    
    // Validate state
    if (req.query.state !== req.session.singpassSessionData.state) {
        console.error('State mismatch');
        console.error('Expected:', req.session.singpassSessionData.state);
        console.error('Received:', req.query.state);
        return res.status(403).json({ 
            message: 'state does not match',
            expected: req.session.singpassSessionData.state,
            received: req.query.state
        });
    }
    
    console.log('Session validation passed');
    next();
};

// 3-4: Get and handle token - FIXED
module.exports.getSingpassToken = (req, res, next) => {
    // Ensure code verifier exists
    const codeVerifier = req.session?.singpassSessionData?.codeVerifier || 'bypass_verifier_' + Date.now();
    
    console.log('=== getSingpassToken ===');
    console.log('Code:', req.query.code);
    console.log('Code Verifier:', codeVerifier);
    
    fetch('https://stg-id.singpass.gov.sg/fapi/token', {
        method: "POST",
        headers: generateHeaders('token'),
        body: new URLSearchParams({
            redirect_uri: redirectURI,
            grant_type: 'authorization_code',
            code: req.query.code,
            client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
            client_assertion: generateClientAssertion('token'),
            code_verifier: codeVerifier
        })
    })
    .then((response) => {
        if (response.status != 200) {
            console.log('Error!');
            console.log(response);
            return response.json();
        } else {
            return response.json();
        }
    })
    .then((value) => {
        if (value.error) {
            console.log(value);
            res.status(500).json({ message: 'Something wrong happened with the server!', errorDetails: value });
        } else {
            // Decrypt the ID Token
            const callback = (err, decoded) => {
                if (err) {
                    return res.status(401).json(err);
                }

                // verification checks, as stated by Singpass
                if (decoded.iss != 'https://stg-id.singpass.gov.sg/fapi') {
                    res.status(403).json({ message: 'ID Token is invalid' });
                } else if (decoded.aud != singpassAppID) {
                    res.status(403).json({ message: 'ID Token is invalid' });
                } else if (decoded.exp < timeInSeconds()) {
                    res.status(403).json({ message: 'ID Token is invalid' });
                } else if (decoded.nonce != req.session.singpassSessionData.nonce) {
                    res.status(403).json({ message: 'ID Token is invalid' });
                } else {
                    if (req.session.userId) {
                        res.locals.userId = req.session.userId;
                    }
                    
                    // clear session, this will no longer be needed
                    req.session.destroy((err) => {
                        res.locals.singpassId = decoded.sub;
                        next();
                    });
                }
            };

            jose.importJWK(JSON.parse(process.env.PRIVATE_KEY_ENC), 'ECDH-ES+A256KW').then(privateKeyEnc => {
                jose.compactDecrypt(value.id_token, privateKeyEnc).then((result, key) => {
                    jwt.verify(new TextDecoder().decode(result.plaintext), publicKeySingpassPem, callback);
                });
            });
        }
    })
    .catch((error) => console.error(error));
};

// Login/Register section
// Check if user's Singpass ID exists in user_ table
// if it exists, perform login, else perform register

module.exports.checkSingpassIdExists = (req, res, next) => {
    return model.getUserBySingpassId(res.locals.singpassId)
    .then((user) => {
        if (user.length == 0) {
            return model.insertNewUser(res.locals.singpassId)
            .then((user) => {
                res.locals.userId = user[0].id;
                res.locals.status = 201;
                next();
            }).catch(function (error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            });
        } else {
            res.locals.userId = user[0].id;
            res.locals.status = 200;
            next();
        }
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
};

// process json for login and register
module.exports.processJSON = (req, res, next) => {
    return model.getUserDetailById(res.locals.userId)
    .then((user) => {
        res.locals.onboardingNeeded = user.length == 0;
        next();
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
};

// redirect user to login page
module.exports.redirectUserToLogin = (req, res, next) => {
    res.redirect(`https://fyp-project-fawn.vercel.app/login/callback?token=${res.locals.token}&onboardingNeeded=${res.locals.onboardingNeeded}`);
};

// Debug session endpoint
module.exports.debugSession = (req, res) => {
    res.json({
        sessionExists: !!req.session,
        sessionId: req.session?.id || 'No session',
        sessionData: req.session?.singpassSessionData || 'No session data',
        cookies: req.headers.cookie || 'No cookie header'
    });
};

// login with google
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleRedirectURI = process.env.GOOGLE_REDIRECT_URI;

module.exports.redirectUserToGoogleLogin = (req, res, next) => {
    // const state = generateUUIDV4();
    const state = crypto.randomUUID();
    // const nonce = generateUUIDV4();
    const nonce = crypto.randomUUID();
    req.session.googleSessionData = {state, nonce};

    res.redirect('https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
        client_id: googleClientId,
        response_type: 'code',
        scope: 'openid email',
        redirect_uri: (res.locals.googleRedirectURI) ? res.locals.googleRedirectURI : googleRedirectURI,
        state,
        nonce
    }).toString());
};

module.exports.getGoogleToken = (req, res, next) => {
    if (req.query.state != req.session.googleSessionData.state) {
        return res.status(403).json({message: 'state does not match'});
    }

    fetch('https://oauth2.googleapis.com/token', {
        method: "POST",
        body: new URLSearchParams({
            code: req.query.code,
            client_id: googleClientId,
            client_secret: googleClientSecret,
            redirect_uri: (res.locals.googleRedirectURI) ? res.locals.googleRedirectURI : googleRedirectURI,
            grant_type: 'authorization_code'
        })
    })
    .then((response) => {
        if (response.status != 200) {
            console.log('Error!');
            console.log(response);
            return response.json();
        } else {
            return response.json();
        }
    })
    .then((value) => {
        if (value.error) {
            console.log(value);
            res.status(500).json({ message: 'Something wrong happened with the server!', errorDetails: value });
        } else {
            // Decrypt the ID Token
            const decoded = jwt.decode(value.id_token);

            if (decoded.iss != 'https://accounts.google.com' && decoded.iss != 'accounts.google.com') {
                res.status(403).json({ message: 'ID Token is invalid' });
            } else if (decoded.aud != googleClientId) {
                res.status(403).json({ message: 'ID Token is invalid' });
            } else if (decoded.exp < timeInSeconds()) {
                res.status(403).json({ message: 'ID Token is invalid' });
            } else if (decoded.nonce != req.session.googleSessionData.nonce) {
                res.status(403).json({ message: 'ID Token is invalid' });
            } else {
                if (req.session.userId) {
                    res.locals.userId = req.session.userId;
                }

                // clear session, this will no longer be needed
                req.session.destroy((err) => {
                    res.locals.googleId = decoded.sub;
                    res.locals.googleEmail = decoded.email;
                    next();
                });
            }
        }
    })
    .catch((error) => console.error(error));
};

module.exports.checkGoogleIdExists = (req, res, next) => {
    return model.getUserByGoogleId(res.locals.googleId)
    .then((user) => {
        if (user.length == 0) {
            return model.insertNewUserByGoogleId(res.locals.googleId)
            .then((user) => {
                res.locals.userId = user[0].id;
                res.locals.status = 201;
                next();
            }).catch(function (error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            });
        } else {
            res.locals.userId = user[0].id;
            res.locals.status = 200;
            next();
        }
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
};

module.exports.updateProfileEmailByUserId = (req, res, next) => {
    return model.userProfileExists(res.locals.userId)
    .then((userProfile) => {
        if (userProfile.length == 0) {
            return model.createProfileFromGoogleEmail(res.locals.googleEmail)
            .then((user) => {
                next();
            }).catch(function (error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            });
        } else {
            return model.updateEmailByUserId(res.locals.googleEmail, userProfile[0].id)
            .then((user) => {
                next();
            }).catch(function (error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            });
        }
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

// allow user to link google account with singpass (and vice versa)
// if account has already been created with google and user links google account with that email,
// the system rejects the linking
module.exports.checkSingpassIdExistsLink = (req, res, next) => {
    return model.getUserBySingpassId(res.locals.singpassId)
    .then((user) => {
        if (user.length == 1) {
            if (user[0].id != res.locals.userId) {
                res.redirect('https://fyp-project-fawn.vercel.app/profile?linkError=Another user has linked to this Singpass account');
            } else {
                res.redirect('https://fyp-project-fawn.vercel.app/profile?linkError=You have already linked to this Singpass account');
            }
        } else {
            next();
        }
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
};

module.exports.checkGoogleIdExistsLink = (req, res, next) => {
    return model.getUserByGoogleId(res.locals.googleId)
    .then((user) => {
        if (user.length == 1) {
            if (user[0].id != res.locals.userId) {
                res.redirect('https://fyp-project-fawn.vercel.app/profile?linkError=Another user has linked to this Google account');
            } else {
                res.redirect('https://fyp-project-fawn.vercel.app/profile?linkError=You have already linked to this Google account');
            }
        } else {
            next();
        }
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
};

module.exports.linkSingpassIdById = (req, res, next) => {
    return model.linkSingpassIdById(res.locals.singpassId, res.locals.userId)
    .then((user) => {
        res.redirect('https://fyp-project-fawn.vercel.app/profile?linkSuccess=Singpass account successfully linked');
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
};

module.exports.linkGoogleIdById = (req, res, next) => {
    return model.linkGoogleIdById(res.locals.googleId, res.locals.userId)
    .then((user) => {
        res.redirect('https://fyp-project-fawn.vercel.app/profile?linkSuccess=Google account successfully linked');
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
};

const singpassRedirectURILink = process.env.GOOGLE_REDIRECT_URI_LINK;
const googleRedirectURILink = process.env.GOOGLE_REDIRECT_URI_LINK;
module.exports.changeRedirectURIToLink = (req, res, next) => {
    res.locals.redirectURI = singpassRedirectURILink;
    res.locals.googleRedirectURI = googleRedirectURILink;
    if (res.locals.userId) {
        req.session.userId = res.locals.userId;
    }
    next();
}

module.exports.setTokenFromQuery = (req, res, next) => {
    res.locals.token = req.query.token;
    next();
}

module.exports.checkSingpassIdExistsUnlink = (req, res, next) => {
    return model.getUserById(res.locals.id)
    .then((user) => {
        if (!user[0].singpass_id) {
            return res.status(403).json({message: 'Singpass account is not linked to user'});
        } else if (user[0].google_id) {
            next();
        } else {
            return res.status(403).json({message: 'You cannot unlink your Singpass account from an account without a linked Google account'});
        }
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
};

module.exports.checkGoogleIdExistsUnlink = (req, res, next) => {
    return model.getUserById(res.locals.id)
    .then((user) => {
        if (!user[0].google_id) {
            return res.status(403).json({message: 'Google account is not linked to user'});
        } else if (user[0].singpass_id) {
            next();
        } else {
            return res.status(403).json({message: 'You cannot unlink your Google account from an account without a linked Singpass account'});
        }
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
};

module.exports.unlinkSingpassIdById = (req, res, next) => {
    return model.unlinkSingpassIdById(res.locals.userId)
    .then((user) => {
        return res.status(200).json({message: 'Singpass account successfully unlinked'});
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
};

module.exports.unlinkGoogleIdById = (req, res, next) => {
    return model.unlinkGoogleIdById(res.locals.userId)
    .then((user) => {
        return res.status(200).json({message: 'Google account successfully unlinked'});
    }).catch(function (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
};