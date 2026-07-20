const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");
const upload = require("../middlewares/upload");
const jwtMiddleware = require("../middlewares/jwtmiddleware");

// Company logo upload
router.post("/company-logo", jwtMiddleware.verifyToken, upload.single("logo"), uploadController.uploadCompanyLogo);

// Company banner upload
router.post("/company-banner", jwtMiddleware.verifyToken, upload.single("banner"), uploadController.uploadCompanyBanner);

// Company profile image upload
router.post("/company-profile", jwtMiddleware.verifyToken, upload.single("profile"), uploadController.uploadCompanyProfile);

// Profile picture upload (NEW)
router.post("/profile-picture", jwtMiddleware.verifyToken, upload.single("profile"), uploadController.uploadProfilePicture);

module.exports = router;