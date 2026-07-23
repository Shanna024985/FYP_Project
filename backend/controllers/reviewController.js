const reviewModel = require("../models/reviewModel");
const { query } = require("../services/dbConnection");

// Helper: Get user ID from JWT token
const getUserIdFromReq = (req, res) => {
    return res?.locals?.userId || req.user?.userId || req.user?.id;
};

// CREATE - Create a review (only if user completed a job)
module.exports.createReview = (req, res, next) => {
    const userId = getUserIdFromReq(req, res);
    let { company_id, rating, message } = req.body;

    console.log('=== createReview ===');
    console.log('userId from token:', userId);
    console.log('company_id:', company_id);
    console.log('rating:', rating);

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

    if (!company_id || !rating || !message) {
        return res.status(400).json({
            error: "Company ID, rating, and message are required"
        });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({
            error: "Rating must be between 1 and 5"
        });
    }

    if (message.length < 10) {
        return res.status(400).json({
            error: "Message must be at least 10 characters"
        });
    }

    // Check if user has completed a job with this company
    return reviewModel.hasCompletedJobWithCompany(userId, company_id)
        .then(function (completedJobs) {
            if (completedJobs.length === 0) {
                return res.status(403).json({
                    error: "You must complete a job with this company before reviewing."
                });
            }

            // // Check if user already reviewed this company
            // return reviewModel.hasUserReviewedCompany(userId, company_id)
            //     .then(function (reviewCheck) {
            //         if (reviewCheck.length > 0) {
            //             return res.status(400).json({
            //                 error: "You have already reviewed this company."
            //             });
            //         }

                    // Create the review
                    return reviewModel.createReview({ company_id, user_id: userId, rating, message })
                        .then(function (review) {
                            res.status(201).json({
                                message: "Review submitted successfully",
                                review: review[0]
                            });
                        }).catch(function (error) {
                            console.error(error);
                            return res.status(500).json({ error: error.message });
                        });
                // });
        }).catch(function (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// READ - Get all reviews for a company (WITH STATISTICS)
module.exports.getReviewsByCompany = (req, res, next) => {
    let companyId = req.params.companyId;

    console.log('=== getReviewsByCompany ===');
    console.log('companyId:', companyId);

    return reviewModel.getReviewsByCompany(companyId)
        .then(function (reviews) {
            const total = reviews.length;

            // Calculate statistics
            let sum = 0;
            const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

            reviews.forEach(function (review) {
                sum += review.rating;
                const roundedRating = Math.round(review.rating);
                if (distribution[roundedRating] !== undefined) {
                    distribution[roundedRating]++;
                }
            });

            const average = total > 0 ? (sum / total) : 0;

            res.json({
                count: total,
                reviews: reviews,
                statistics: {
                    total_reviews: total,
                    average_rating: parseFloat(average.toFixed(1)),
                    rating_distribution: distribution
                }
            });
        }).catch(function (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// READ - Get average rating for a company
module.exports.getAverageRating = (req, res, next) => {
    let companyId = req.params.companyId;

    return reviewModel.getAverageRating(companyId)
        .then(function (rating) {
            res.json({
                average_rating: parseFloat(rating[0].average_rating),
                total_reviews: parseInt(rating[0].total_reviews)
            });
        }).catch(function (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// READ - Get review by ID
module.exports.getReviewById = (req, res, next) => {
    let reviewId = req.params.id;

    return reviewModel.getReviewById(reviewId)
        .then(function (review) {
            if (review.length === 0) {
                return res.status(404).json({ error: "Review not found" });
            }
            res.json({ review: review[0] });
        }).catch(function (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// READ - Get my reviews (WITH STATISTICS)
module.exports.getMyReviews = (req, res, next) => {
    const userId = getUserIdFromReq(req, res);

    console.log('=== getMyReviews ===');
    console.log('userId from token:', userId);

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

    return reviewModel.getReviewsByUser(userId)
        .then(function (reviews) {
            const total = reviews.length;

            // Calculate statistics
            let sum = 0;
            const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

            reviews.forEach(function (review) {
                sum += review.rating;
                const roundedRating = Math.round(review.rating);
                if (distribution[roundedRating] !== undefined) {
                    distribution[roundedRating]++;
                }
            });

            const average = total > 0 ? (sum / total) : 0;

            res.json({
                count: total,
                reviews: reviews,
                statistics: {
                    total_reviews: total,
                    average_rating: parseFloat(average.toFixed(1)),
                    rating_distribution: distribution
                }
            });
        }).catch(function (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// UPDATE - Update a review
module.exports.updateReview = (req, res, next) => {
    const userId = getUserIdFromReq(req, res);
    let reviewId = req.params.id;
    let { rating, message } = req.body;

    console.log('=== updateReview ===');
    console.log('userId from token:', userId);
    console.log('reviewId:', reviewId);
    console.log('rating:', rating);
    console.log('message:', message);

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

    if (!rating && !message) {
        return res.status(400).json({
            error: "Rating or message is required for update"
        });
    }

    if (rating && (rating < 1 || rating > 5)) {
        return res.status(400).json({
            error: "Rating must be between 1 and 5"
        });
    }

    if (message && message.length < 10) {
        return res.status(400).json({
            error: "Message must be at least 10 characters"
        });
    }

    return reviewModel.updateReview(reviewId, userId, rating, message)
        .then(function (updated) {
            if (updated.length === 0) {
                return res.status(404).json({
                    error: "Review not found or you don't own it"
                });
            }
            res.json({
                message: "Review updated successfully",
                review: updated[0]
            });
        }).catch(function (error) {
            console.error('Update review error:', error);
            return res.status(500).json({ error: error.message });
        });
}

// DELETE - Delete a review
module.exports.deleteReview = (req, res, next) => {
    const userId = getUserIdFromReq(req, res);
    let reviewId = req.params.id;

    console.log('=== deleteReview ===');
    console.log('userId from token:', userId);
    console.log('reviewId:', reviewId);

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

    return reviewModel.deleteReview(reviewId, userId)
        .then(function (deleted) {
            if (deleted.length === 0) {
                return res.status(404).json({
                    error: "Review not found or you don't own it"
                });
            }
            res.json({
                message: "Review deleted successfully",
                deletedId: deleted[0].id
            });
        }).catch(function (error) {
            console.error('Delete review error:', error);
            return res.status(500).json({ error: error.message });
        });
}