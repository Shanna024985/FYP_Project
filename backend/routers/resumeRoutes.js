const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resumeController");
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router.post("/", jwtMiddleware.verifyToken, resumeController.createResume);

module.exports = router;