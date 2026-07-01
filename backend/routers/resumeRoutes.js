const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resumeController");
const upload = require("../middlewares/upload");

// Upload resume (form-data: file)
router.post("/upload", upload.single("resume"), resumeController.uploadResume);

// Get all resumes for a user
router.get("/user", resumeController.getResumesByUser);

// Get specific resume by ID
router.get("/:id", resumeController.getResumeById);

// Delete a resume
router.delete("/:id", resumeController.deleteResume);

module.exports = router;