const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");
const upload = require("../middlewares/upload");

// Company logo upload (NO AUTH for testing)
router.post("/company-logo", upload.single("logo"), uploadController.uploadCompanyLogo);

module.exports = router;