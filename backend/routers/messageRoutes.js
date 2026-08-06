const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.delete("/:id", messageController.checkMessageExists, messageController.deleteMessageById);
router.put("/:id", messageController.checkMessageExists, messageController.updateMessageById);

router.post("/", messageController.checkReceiverUserIdExists, messageController.createMessage);
router.get("/list", messageController.getUserList);
router.get("/:userId", messageController.getMessageWithUserByUserId, messageController.updateMessagesToRead);

router.get("/count", messageController.getUnreadMessageCount);

module.exports = router;