const express = require("express");
const router = express.Router();

const jobRoutes = require("./jobRoutes");
const companyRoutes = require("./companyRoutes");
const uploadRoutes = require("./uploadRoutes");

router.get("/", (req, res, next) => {
    res.send("You are connected!");
});


router.use("/jobs", jobRoutes);
router.use("/company", companyRoutes);
router.use("/upload", uploadRoutes);

module.exports = router;