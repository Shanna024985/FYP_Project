const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// Company routes (SPECIFIC routes first)
router.post("/company", jwtMiddleware.verifyToken, jobController.createCompany);
router.get("/my/companies", jwtMiddleware.verifyToken, jobController.getMyCompanies);
router.get("/my/jobs", jwtMiddleware.verifyToken, jobController.getMyJobs);

// Public job routes
router.get("/", jobController.getAllJobs);

// Parameter routes (GENERIC routes last)
router.get("/:id", jobController.getJobById);
router.post("/", jwtMiddleware.verifyToken, jobController.createJob);
router.put("/:id", jwtMiddleware.verifyToken, jobController.updateJob);
router.delete("/:id", jwtMiddleware.verifyToken, jobController.deleteJob);
router.patch("/:id/close", jwtMiddleware.verifyToken, jobController.closeJob);

// Application routes
const applicationRoutes = require('./applicationRoutes');
router.use("/:id/application", jwtMiddleware.verifyToken, applicationRoutes);

module.exports = router;