const express = require("express");
const router = express.Router();

router.get("/",(req,res,next)=>{
    res.send("You are connected!")
});

// routers
const loginRoutes = require('./loginRoutes');
router.use("/auth", loginRoutes);

const jobRoutes = require("./jobRoutes");
router.use("/jobs", jobRoutes);

const resumeRoutes = require("./resumeRoutes");
router.use("/resume", resumeRoutes);

const userRoutes = require("./userRoutes");
router.use("/user", userRoutes);

module.exports = router;