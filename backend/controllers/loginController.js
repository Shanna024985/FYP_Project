const jwt = require("jsonwebtoken");
const crypto = require("crypto")
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

// SINGPASS LOGIN INTEGRATION
// Generate UUID V4 (this is for state and nonce)
const generateRandomHex = length => {
    let hex = Math.floor(Math.random() * (16 ** length)).toString(16);
    while (hex.length < length) {
        hex = '0' + hex;
    }
    return hex;
};
const generateUUIDV4 = () => generateRandomHex(8) + '-' + generateRandomHex(4) + '-' + generateRandomHex(4) + '-' + generateRandomHex(12);
const singpassAppID = process.env.SINGPASS_APP_ID;
const options = {
    algorithm: 'ES256'
};
const privateKey = JSON.parse(process.env.SINGPASS_PRIVATE_KEY_SIG);
const privateKeyPem = crypto.createPrivateKey({key: privateKey, format: 'jwk'}).export({type: 'pkcs8', format: 'pem'})
const publicKey = JSON.parse(process.env.SINGPASS_PUBLIC_KEY_SIG);
const generateCode = () => {
    let codeVerifier = ''
    for (let i = 0; i < 128; i ++) {
        codeVerifier += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'.charAt(Math.floor(Math.random() * 64));
    }
    let codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64').replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
    return {codeVerifier, codeChallenge}
}
const timeInSeconds = () => parseInt(Date.now() / 1000)
const secretKey = process.env.JWT_SECRET_KEY.trim();

// 1: Redirect user to Singpass login, to do this a authorization URL must be returned
module.exports.createSingpassURL = (req, res, next) => {
    // POST authorization request (https://stg-id.singpass.gov.sg/fapi/.well-known/openid-configuration)
    const state = generateUUIDV4();
    const nonce = generateUUIDV4();
    const code = generateCode();

    const clientAssertion = jwt.sign({
        sub: singpassAppID,
        aud: 'https://stg-id.singpass.gov.sg/fapi/par',
        iss: singpassAppID,
        iat: timeInSeconds(),
        exp: timeInSeconds() + 120,
        jti: generateUUIDV4()
    }, privateKeyPem, {
        ...options,
        header: {
            kid: privateKey.kid
        }
    });

    const dpopjkt = jwt.sign({
        htm: 'POST',
        htu: 'https://stg-id.singpass.gov.sg/fapi/par',
        iat: timeInSeconds(),
        exp: timeInSeconds() + 120,
        jti: generateUUIDV4()
    }, privateKeyPem, {
        ...options,
        header: {
            typ: 'dpop+jwt',
            jwk: publicKey
        }
    });
    
    const body = {
        response_type: 'code',
        scope: 'user.identity',
        state,
        nonce,
        client_id: singpassAppID,
        redirect_uri: 'localhost:5174',
        client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        client_assertion: clientAssertion,
        code_challenge: code.codeChallenge,
        code_challenge_method: 'S256',
        dpop_jkt: dpopjkt,
        authentication_context_type: 'APP_AUTHENTICATION_DEFAULT',
        authentication_context_message: 'Authentication using Singpass to login to Microjobs.Shop'
    }
    
    fetch('https://stg-id.singpass.gov.sg/fapi/par', {
        method: "POST",
        headers: new Headers().append("Content-Type", "application/x-www-form-urlencoded"),
        body: new URLSearchParams(body)
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
            res.status(500).json(value);
        } else {
            // Redirect the user to the Singpass auth page (https://stg-id.singpass.gov.sg/fapi/auth)
            // {state, nonce, codeVerifier} needs to be stored as a session for later
            req.session = {state, nonce, codeVerifier}
            res.status(200).json({
                singpassAuthURL: `https://stg-id.singpass.gov.sg/fapi/auth?client_id=${singpassAppID}&request_uri=${value.request_uri}`,
            });
        }
    })
    .catch((error) => console.error(error));
}