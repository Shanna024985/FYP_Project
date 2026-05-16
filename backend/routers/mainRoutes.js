const express = require("express");
const router = express.Router();

const jobRoutes = require("./jobRoutes");

router.get("/", (req, res, next) => {
    res.send("You are connected!");
});


router.use("/jobs", jobRoutes);

module.exports = router;