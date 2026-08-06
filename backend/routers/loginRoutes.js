const express = require('express');
const loginController = require('../controllers/loginController');
const jwtMiddleware = require('../middlewares/jwtmiddleware');
const router = express.Router();

router.get('/', loginController.createSingpassURL);
router.get('/token', loginController.checkRedirectIsValid, loginController.getSingpassToken, loginController.checkSingpassIdExists, jwtMiddleware.generateToken, loginController.processJSON, loginController.redirectUserToLogin);
router.get('/google', loginController.redirectUserToGoogleLogin);
router.get('/google/token', loginController.getGoogleToken, loginController.checkGoogleIdExists, jwtMiddleware.generateToken, loginController.processJSON, loginController.redirectUserToLogin);

router.get('/link', loginController.setTokenFromQuery, jwtMiddleware.verifyToken, loginController.changeRedirectURIToLink, loginController.createSingpassURL);
router.get('/link/google', loginController.setTokenFromQuery, jwtMiddleware.verifyToken, loginController.changeRedirectURIToLink, loginController.redirectUserToGoogleLogin);
router.get('/link/token', loginController.changeRedirectURIToLink, loginController.checkRedirectIsValid, loginController.getSingpassToken, loginController.checkSingpassIdExistsLink, loginController.linkSingpassIdById);
router.get('/link/google/token', loginController.changeRedirectURIToLink, loginController.getGoogleToken, loginController.checkGoogleIdExistsLink, loginController.linkGoogleIdById);

module.exports = router;