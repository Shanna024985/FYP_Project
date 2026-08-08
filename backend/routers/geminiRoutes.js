const express = require("express");
const router = express.Router();
const geminiController = require("../controllers/geminiController");
const { verifyToken } = require("../middlewares/jwtmiddleware");

// ==================== PROTECTED ROUTES ====================

// Main chat endpoint
router.post("/chat", verifyToken, geminiController.chat);

// Get job recommendations
router.get("/recommendations", verifyToken, geminiController.getRecommendations);

// FAQ endpoint
router.post("/faq", verifyToken, geminiController.faq);

// Resume tips
router.post("/resume-tips", verifyToken, geminiController.resumeTips);

// Career guidance
router.post("/career-guidance", verifyToken, geminiController.careerGuidance);

// Interview tips
router.post("/interview-tips", verifyToken, geminiController.interviewTips);

// Job search advice
router.post("/job-search", verifyToken, geminiController.jobSearch);

// Company insights
router.post("/company-insights", verifyToken, geminiController.companyInsights);

// Skill advice
router.post("/skill-advice", verifyToken, geminiController.skillAdvice);

// Platform help
router.post("/platform-help", verifyToken, geminiController.platformHelp);

// Work environment
router.post("/work-environment", verifyToken, geminiController.workEnvironment);

// Freelancer advice
router.post("/freelancer-advice", verifyToken, geminiController.freelancerAdvice);

// Salary negotiation
router.post("/salary-negotiation", verifyToken, geminiController.salaryNegotiation);

module.exports = router;