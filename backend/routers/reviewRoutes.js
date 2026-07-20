const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { verifyToken } = require("../middlewares/jwtmiddleware");

// ==================== PUBLIC ROUTES (No authentication needed) ====================
router.get("/company/:companyId", reviewController.getReviewsByCompany);
router.get("/company/:companyId/average", reviewController.getAverageRating);
router.get("/:id", reviewController.getReviewById);

// ==================== PROTECTED ROUTES (Authentication required) ====================
router.post("/", verifyToken, reviewController.createReview);
router.get("/user/my", verifyToken, reviewController.getMyReviews);
router.put("/:id", verifyToken, reviewController.updateReview);
router.delete("/:id", verifyToken, reviewController.deleteReview);

module.exports = router;