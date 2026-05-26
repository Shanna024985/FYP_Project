const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.send("You are connected!");
});

// routers
const loginRouter = require("./loginRouter");
router.use("/auth", loginRouter);

module.exports = router;