const { query } = require("../services/dbConnection");

// CREATE - Create a review
module.exports.createReview = function createReview(reviewData) {
    const { company_id, user_id, rating, message } = reviewData;
    
    let sql = `INSERT INTO review(company_id, user_id, rating, message, created_at) 
               VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) 
               RETURNING *;`;
    
    return query(sql, [company_id, user_id, rating, message])
        .then(function(result) {
            return result.rows;
        });
}

// READ - Get all reviews for a company
module.exports.getReviewsByCompany = function getReviewsByCompany(companyId) {
    let sql = `SELECT r.*, u.singpass_id as username 
               FROM review r 
               JOIN user_ u ON r.user_id = u.id 
               WHERE r.company_id = $1 
               ORDER BY r.created_at DESC;`;
    
    return query(sql, [companyId])
        .then(function(result) {
            return result.rows;
        });
}

// READ - Get average rating for a company
module.exports.getAverageRating = function getAverageRating(companyId) {
    let sql = `SELECT COALESCE(AVG(rating), 0) as average_rating, 
                      COUNT(*) as total_reviews 
               FROM review 
               WHERE company_id = $1;`;
    
    return query(sql, [companyId])
        .then(function(result) {
            return result.rows;
        });
}

// READ - Get review by ID
module.exports.getReviewById = function getReviewById(reviewId) {
    let sql = `SELECT r.*, u.singpass_id as username, c.name as company_name
               FROM review r 
               JOIN user_ u ON r.user_id = u.id
               JOIN company c ON r.company_id = c.id
               WHERE r.id = $1;`;
    
    return query(sql, [reviewId])
        .then(function(result) {
            return result.rows;
        });
}

// READ - Get reviews by user
module.exports.getReviewsByUser = function getReviewsByUser(userId) {
    let sql = `SELECT r.*, c.name as company_name 
               FROM review r 
               JOIN company c ON r.company_id = c.id 
               WHERE r.user_id = $1 
               ORDER BY r.created_at DESC;`;
    
    return query(sql, [userId])
        .then(function(result) {
            return result.rows;
        });
}

// CHECK - Check if user has completed a job with company
module.exports.hasCompletedJobWithCompany = function hasCompletedJobWithCompany(userId, companyId) {
    let sql = `SELECT a.id, a.status 
               FROM application a 
               JOIN job j ON a.job_id = j.id 
               WHERE a.user_id = $1 
               AND j.company_id = $2 
               AND a.status IN ('Offer', 'Onboard')`;
    
    return query(sql, [userId, companyId])
        .then(function(result) {
            return result.rows;
        });
}

// CHECK - Check if user already reviewed this company
module.exports.hasUserReviewedCompany = function hasUserReviewedCompany(userId, companyId) {
    let sql = `SELECT id FROM review WHERE user_id = $1 AND company_id = $2;`;
    
    return query(sql, [userId, companyId])
        .then(function(result) {
            return result.rows;
        });
}

// UPDATE - Update a review
module.exports.updateReview = function updateReview(reviewId, userId, rating, message) {
    let sql = `UPDATE review 
               SET rating = COALESCE($1, rating),
                   message = COALESCE($2, message)
               WHERE id = $3 AND user_id = $4
               RETURNING *;`;
    
    return query(sql, [rating, message, reviewId, userId])
        .then(function(result) {
            return result.rows;
        });
}

// DELETE - Delete a review
module.exports.deleteReview = function deleteReview(reviewId, userId) {
    let sql = `DELETE FROM review WHERE id = $1 AND user_id = $2 RETURNING id;`;
    
    return query(sql, [reviewId, userId])
        .then(function(result) {
            return result.rows;
        });
}
