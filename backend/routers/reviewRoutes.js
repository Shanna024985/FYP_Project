const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { verifyToken } = require('../middlewares/jwtmiddleware');

// Public routes (anyone can view reviews)
router.get("/company/:companyId", reviewController.getReviewsByCompany);
router.get("/company/:companyId/average", reviewController.getAverageRating);
router.get("/:id", reviewController.getReviewById);

// Protected routes (only authenticated users)
router.post("/",verifyToken, reviewController.createReview);
router.get("/user/my", reviewController.getMyReviews);
router.put("/:id", reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);

module.exports = router;