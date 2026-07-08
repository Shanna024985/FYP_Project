const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const resumeController = require("../controllers/resumeController");
const applicationController = require("../controllers/applicationController");
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// Company routes (SPECIFIC routes first)
router.post("/company", jwtMiddleware.verifyToken, jobController.createCompany);
router.get("/my/companies", jwtMiddleware.verifyToken, jobController.getMyCompanies);
router.get("/my/jobs", jwtMiddleware.verifyToken, jobController.getMyJobs);

// update status of application
router.put("/application/:id", jwtMiddleware.verifyToken, applicationController.verifyStatus, applicationController.getJobIdByApplicationId, applicationController.verifyJobOwnership, applicationController.updateStatusById);

// Public job routes
router.get("/", jobController.getAllJobs);

// Parameter routes (GENERIC routes last)
router.get("/:id", jobController.getJobById);
router.post("/", jwtMiddleware.verifyToken, jobController.createJob);
router.put("/:id", jwtMiddleware.verifyToken, jobController.updateJob);
router.delete("/:id", jwtMiddleware.verifyToken, jobController.deleteJob);
router.patch("/:id/close", jwtMiddleware.verifyToken, jobController.closeJob);

// Application routes
router.post("/:id/apply", jwtMiddleware.verifyToken, applicationController.verifyJobId, applicationController.verifyJobExists, resumeController.verifyResumeExists, resumeController.verifyResumeOwnership);

const applicationRoutes = require('./applicationRoutes');
router.use("/:jobId/application", jwtMiddleware.verifyToken, applicationController.verifyJobId, applicationController.verifyJobExists, applicationController.verifyJobOwnership, applicationRoutes);

module.exports = router;