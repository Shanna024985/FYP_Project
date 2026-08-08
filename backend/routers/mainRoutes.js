const express = require("express");
const router = express.Router();
const loginRoutes = require("./loginRoutes");
const jobRoutes = require("./jobRoutes");
const companyRoutes = require("./companyRoutes");
const uploadRoutes = require("./uploadRoutes");
const locationRoutes = require("./locationRoutes");
const resumeRoutes = require("./resumeRoutes");
const reviewRoutes = require("./reviewRoutes");
const userRoutes = require("./userRoutes");
const geminiRoutes = require("./geminiRoutes");

router.get("/", (req, res, next) => {
    res.send("You are connected!");
});

router.use("/auth", loginRoutes);
router.use("/jobs", jobRoutes);
router.use("/company", companyRoutes);
router.use("/upload", uploadRoutes);
router.use("/locations", locationRoutes);
router.use("/resumes", resumeRoutes);
router.use("/reviews", reviewRoutes);
router.use("/user", userRoutes);
router.use("/ai", geminiRoutes);

module.exports = router;