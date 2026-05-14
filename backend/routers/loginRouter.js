const express = require('express');
const loginController = require('../controllers/loginController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const router = express.Router();

router.post('/', loginController.createSingpassURL);
router.post('/token', loginController.checkRedirectIsValid, loginController.getSingpassToken, loginController.checkSingpassIdExists, jwtMiddleware.generateToken, loginController.processJSON);

module.exports = router;