const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const jwtMiddleware = require("../middlewares/jwtmiddleware");

// ==================== PUBLIC JOB ROUTES ====================
router.get("/", jobController.getAllJobs);
router.get("/recommended", jobController.getRecommendedJobs);
router.get("/:id", jobController.getJobById);
router.get("/company/:companyId/jobs", jobController.getJobsByCompany);

// ==================== EMPLOYER DASHBOARD ====================
router.get("/employer/dashboard", jobController.getEmployerDashboard); // NEW

// ==================== JOB CRUD (Protected) ====================
router.post("/", jobController.createJob);
router.put("/:id", jobController.updateJob);
router.delete("/:id", jobController.deleteJob);
router.patch("/:id/close", jobController.closeJob);
router.patch("/:id/open", jobController.openJob); // NEW

// ==================== APPLICATIONS ====================
router.post("/:id/apply", jobController.applyForJob);
router.get("/applications/my", jobController.getMyApplications);
router.get("/applications/stats", jobController.getApplicationStats);
router.get("/:id/applications", jobController.getJobApplications);
router.patch("/applications/:applicationId/status", jobController.updateApplicationStatus);
router.delete("/applications/:applicationId", jobController.deleteApplication);

// ==================== SAVED JOBS ====================
router.post("/:id/save", jwtMiddleware.verifyToken,jobController.saveJob);
router.delete("/:id/save", jwtMiddleware.verifyToken, jobController.unsaveJob);
router.get("/saved/user", jwtMiddleware.verifyToken, jobController.getSavedJobs);
router.get("/:id/is-saved", jwtMiddleware.verifyToken, jobController.isJobSaved);

// ==================== JOB COMPLETION & REVIEW ====================
router.get("/completed/user", jobController.getCompletedJobs);
router.get("/company/:companyId/completed-jobs", jobController.getCompanyCompletedJobs);
router.get("/company/:companyId/can-review", jobController.canReviewCompany);

// ==================== DASHBOARD ====================
router.get("/dashboard/job-seeker", jobController.getJobSeekerDashboard);

// ==================== USER RESUMES ====================
router.get("/resumes/user", jobController.getUserResumes);

module.exports = router;