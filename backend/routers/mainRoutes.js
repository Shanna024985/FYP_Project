const express = require("express");
const router = express.Router();
const jwtMiddleware = require('../middlewares/jwtmiddleware');

// routers
const loginRoutes = require('./loginRoutes');
const jobRoutes = require("./jobRoutes");
const companyRoutes = require("./companyRoutes");
const uploadRoutes = require("./uploadRoutes");
const locationRoutes = require("./locationRoutes");
const reviewRoutes = require("./reviewRoutes");
const userRoutes = require("./userRoutes");
const resumeRoutes = require("./resumeRoutes");
const messageRoutes = require("./messageRoutes");
const geminiRoutes = require("./geminiRoutes");

router.get("/", (req, res, next) => {
    res.send("You are connected!");
});

router.use("/auth", loginRoutes);
router.use("/jobs", jobRoutes);
router.use("/resume", resumeRoutes);
router.use("/resumes", resumeRoutes);
router.use("/user", userRoutes);
router.use("/message", jwtMiddleware.verifyToken, messageRoutes);
router.use("/company", companyRoutes);
router.use("/upload", uploadRoutes);
router.use("/locations", locationRoutes);
router.use("/reviews", reviewRoutes);
router.use("/ai", geminiRoutes);

module.exports = router;