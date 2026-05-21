const express = require("express");
const router = express.Router();

router.get("/",(req,res,next)=>{
    res.send("You are connected!")
});

// routers
const loginRouter = require('./loginRoutes');
router.use("/auth", loginRoutes);

const jobRoutes = require("./jobRoutes");
router.use("/jobs", jobRoutes);

module.exports = router;