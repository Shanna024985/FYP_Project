const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.delete("/:id", messageController.checkMessageExists, messageController.deleteMessageById);
router.put("/:id", messageController.checkMessageExists, messageController.updateMessageById);

router.post("/", messageController.checkReceiverUserIdExists, messageController.createMessage);
router.get("/list", messageController.getUserList);
router.get("/count", messageController.getUnreadMessageCount);
router.get("/:userId", messageController.getMessageWithUserByUserId, messageController.updateMessagesToRead);

module.exports = router;