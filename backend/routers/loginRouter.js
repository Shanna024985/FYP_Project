const express = require('express');
const loginController = require('../controllers/loginController');
const router = express.Router();

router.post('/', loginController.createSingpassURL);

module.exports = router;