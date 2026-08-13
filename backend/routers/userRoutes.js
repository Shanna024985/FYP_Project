const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middlewares/upload");
const jwtMiddleware = require("../middlewares/jwtmiddleware");

// ==================== USER PROFILE ROUTES ====================

// Create user profile
router.post("/profile", jwtMiddleware.verifyToken, userController.createUserProfile);

// Get user profile
router.get("/profile", jwtMiddleware.verifyToken, userController.getUserProfile);
// Update user profile
router.put("/profile", jwtMiddleware.verifyToken, userController.updateUserProfile);

// Upload profile photo (form-data: profile)
router.post("/profile/photo", jwtMiddleware.verifyToken, upload.single("profile"), userController.uploadProfilePhoto);

// Delete profile photo
router.delete("/profile/photo", jwtMiddleware.verifyToken, userController.deleteProfilePhoto);

module.exports = router;