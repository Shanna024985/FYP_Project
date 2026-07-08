const express = require("express");
const router = express.Router();
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router.get("/",(req,res,next)=>{
    res.send("You are connected!")
});

// routers
const loginRoutes = require('./loginRoutes');
router.use("/auth", loginRoutes);

const loginRoutes = require("./loginRoutes");
const jobRoutes = require("./jobRoutes");
const companyRoutes = require("./companyRoutes");
const uploadRoutes = require("./uploadRoutes");
const locationRoutes = require("./locationRoutes");
const resumeRoutes = require("./resumeRoutes");
const reviewRoutes = require("./reviewRoutes");
const userRoutes = require("./userRoutes");

router.get("/", (req, res, next) => {
    res.send("You are connected!");
});

router.use("/auth", loginRoutes);
router.use("/jobs", jobRoutes);

const resumeRoutes = require("./resumeRoutes");
router.use("/resume", resumeRoutes);

const userRoutes = require("./userRoutes");
router.use("/user", userRoutes);

const messageRoutes = require("./messageRoutes");
router.use("/message", jwtMiddleware.verifyToken, messageRoutes);
router.use("/company", companyRoutes);
router.use("/upload", uploadRoutes);
router.use("/locations", locationRoutes);
router.use("/resumes", resumeRoutes);
router.use("/reviews", reviewRoutes);
router.use("/user", userRoutes);

module.exports = router;