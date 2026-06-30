const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");
const upload = require("../middlewares/upload");

// Company logo upload
router.post("/company-logo", upload.single("logo"), uploadController.uploadCompanyLogo);

// Company banner upload
router.post("/company-banner", upload.single("banner"), uploadController.uploadCompanyBanner);

// Company profile image upload
router.post("/company-profile", upload.single("profile"), uploadController.uploadCompanyProfile);

module.exports = router;

