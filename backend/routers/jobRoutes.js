const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const jwtMiddleware = require("../middlewares/jwtmiddleware");

// ==================== PUBLIC JOB ROUTES ====================
router.get("/", jobController.getAllJobs);
router.get("/recommended", jobController.getRecommendedJobs);
router.get("/company/:companyId/jobs", jobController.getJobsByCompany);

// ==================== DELETED JOBS ROUTES - MUST BE BEFORE /:id ====================
// Get deleted jobs (protected)
router.get("/deleted/company/:companyId", jwtMiddleware.verifyToken, jobController.getDeletedJobsByCompany);
router.get("/deleted/all", jwtMiddleware.verifyToken, jobController.getAllDeletedJobs);  // Admin only

// ==================== SINGLE JOB ROUTES ====================
// This must come AFTER /deleted routes
router.get("/:id", jobController.getJobById);

// ==================== EMPLOYER DASHBOARD ====================
router.get("/employer/dashboard", jwtMiddleware.verifyToken, jobController.getEmployerDashboard);

// ==================== JOB CRUD (Protected) ====================
router.post("/", jwtMiddleware.verifyToken, jobController.createJob);
router.put("/:id", jwtMiddleware.verifyToken, jobController.updateJob);

// SOFT DELETE & RESTORE
router.delete("/:id", jwtMiddleware.verifyToken, jobController.softDeleteJob);  // Soft delete with undo support
router.post("/:id/restore", jwtMiddleware.verifyToken, jobController.restoreJob);  // UNDO deletion

// HARD DELETE - Permanent deletion (use with caution)
// router.delete("/:id/permanent", jwtMiddleware.verifyToken, jobController.hardDeleteJob);

// Close/Open jobs
router.patch("/:id/close", jwtMiddleware.verifyToken, jobController.closeJob);
router.patch("/:id/open", jwtMiddleware.verifyToken, jobController.openJob);

// ==================== APPLICATIONS ====================
router.post("/:id/apply", jwtMiddleware.verifyToken, jobController.applyForJob);
router.get("/applications/my", jwtMiddleware.verifyToken, jobController.getMyApplications);
router.get("/applications/stats", jwtMiddleware.verifyToken, jobController.getApplicationStats);
router.get("/:id/applications", jwtMiddleware.verifyToken, jobController.getJobApplications);
router.patch("/applications/:applicationId/status", jwtMiddleware.verifyToken, jobController.updateApplicationStatus);
router.delete("/applications/:applicationId", jwtMiddleware.verifyToken, jobController.deleteApplication);

// ==================== SAVED JOBS ====================
router.post("/:id/save", jwtMiddleware.verifyToken, jobController.saveJob);
router.delete("/:id/save", jwtMiddleware.verifyToken, jobController.unsaveJob);
router.get("/saved/user", jwtMiddleware.verifyToken, jobController.getSavedJobs);
router.get("/:id/is-saved", jwtMiddleware.verifyToken, jobController.isJobSaved);

// ==================== JOB COMPLETION & REVIEW ====================
router.get("/completed/user", jwtMiddleware.verifyToken, jobController.getCompletedJobs);
router.get("/company/:companyId/completed-jobs", jwtMiddleware.verifyToken, jobController.getCompanyCompletedJobs);
router.get("/company/:companyId/can-review", jwtMiddleware.verifyToken, jobController.canReviewCompany);

// ==================== DASHBOARD ====================
router.get("/dashboard/job-seeker", jwtMiddleware.verifyToken, jobController.getJobSeekerDashboard);

// ==================== USER RESUMES ====================
router.get("/resumes/user", jwtMiddleware.verifyToken, jobController.getUserResumes);

module.exports = router;