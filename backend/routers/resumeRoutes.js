const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resumeController");
const upload = require("../middlewares/upload");
const jwtMiddleware = require("../middlewares/jwtmiddleware");

// Upload resume (form-data: file)
router.post("/upload", upload.single("resume"), jwtMiddleware.verifyToken, resumeController.uploadResume);

// Get all resumes for a user
router.get("/user", jwtMiddleware.verifyToken, resumeController.getResumesByUser);

// Get specific resume by ID
router.get("/:id",jwtMiddleware.verifyToken,  resumeController.getResumeById);

// Delete a resume
router.delete("/:id", jwtMiddleware.verifyToken, resumeController.deleteResume);

// Set a resume as the default
router.put(
    "/:id/default", jwtMiddleware.verifyToken, 
    resumeController.setDefaultResume
);
module.exports = router;