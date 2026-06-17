const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");

// Public job routes
router.get("/", jobController.getAllJobs);
router.get("/:id", jobController.getJobById);
router.get("/company/:companyId/jobs", jobController.getJobsByCompany);

// Protected job routes
router.post("/", jobController.createJob);
router.put("/:id", jobController.updateJob);
router.delete("/:id", jobController.deleteJob);
router.patch("/:id/close", jobController.closeJob);  // ← UNCOMMENTED

module.exports = router;