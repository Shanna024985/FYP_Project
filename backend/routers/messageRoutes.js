const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.get("/list", messageController.getUserList);
router.get("/", messageController.getMessageWithUserByUserId);

module.exports = router;