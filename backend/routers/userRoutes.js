const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middlewares/upload");

// ==================== USER PROFILE ROUTES ====================

// Create user profile
router.post("/profile", userController.createUserProfile);

// Get user profile
router.get("/profile", userController.getUserProfile);

// Update user profile
router.put("/profile", userController.updateUserProfile);

// Upload profile photo (form-data: profile)
router.post("/profile/photo", upload.single("profile"), userController.uploadProfilePhoto);

// Delete profile photo
router.delete("/profile/photo", userController.deleteProfilePhoto);

module.exports = router;