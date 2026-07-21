const express = require('express');
const loginController = require('../controllers/loginController');
const jwtMiddleware = require('../middlewares/jwtmiddleware');
const router = express.Router();

router.get('/', loginController.createSingpassURL);
router.get('/token', loginController.checkRedirectIsValid, loginController.getSingpassToken, loginController.checkSingpassIdExists, jwtMiddleware.generateToken, loginController.processJSON, loginController.redirectUserToLogin);

module.exports = router;