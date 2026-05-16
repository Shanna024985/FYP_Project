const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const { checkWhetherUserIsInside } = require("../controllers/loginController");

// Company routes (SPECIFIC routes first)
router.post("/company", checkWhetherUserIsInside, jobController.createCompany);
router.get("/my/companies", checkWhetherUserIsInside, jobController.getMyCompanies);
router.get("/my/jobs", checkWhetherUserIsInside, jobController.getMyJobs);

// Public job routes
router.get("/", jobController.getAllJobs);

// Parameter routes (GENERIC routes last)
router.get("/:id", jobController.getJobById);
router.post("/", checkWhetherUserIsInside, jobController.createJob);
router.put("/:id", checkWhetherUserIsInside, jobController.updateJob);
router.delete("/:id", checkWhetherUserIsInside, jobController.deleteJob);
router.patch("/:id/close", checkWhetherUserIsInside, jobController.closeJob);

module.exports = router;