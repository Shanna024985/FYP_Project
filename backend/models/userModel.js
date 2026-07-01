const { query } = require("../services/dbConnection");

// ==================== USER AUTH ====================

module.exports.getUserBySingpassId = singpassId => {
    let sql = "SELECT * FROM user_ WHERE singpass_id = $1;";
    return query(sql, [singpassId]).then(function (result) {
        return result.rows;
    });
}

module.exports.insertNewUser = singpassId => {
    let sql = "INSERT INTO user_ (singpass_id) VALUES ($1) RETURNING id;";
    return query(sql, [singpassId]).then(function (result) {
        return result.rows;
    });
}

module.exports.getUserDetailById = id => {
    let sql = "SELECT user_.id FROM user_ JOIN user_detail ON user_.id = user_detail.user_id WHERE user_.id = $1;";
    return query(sql, [id]).then(function (result) {
        return result.rows;
    });
}

// ==================== USER PROFILE ====================

// CREATE - Create user profile
module.exports.createUserProfile = function createUserProfile(profileData) {
    const { 
        user_id, first_name, last_name, phone_number, email,
        linkedin_profile, github_profile
    } = profileData;
    
    let sql = `INSERT INTO user_detail(
        user_id, first_name, last_name, phone_number, email,
        linkedin_profile, github_profile
    ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
    RETURNING *;`;
    
    return query(sql, [
        user_id, first_name, last_name, phone_number, email,
        linkedin_profile || '', 
        github_profile || ''
    ]).then(function(result) {
        return result.rows;
    });
}

// READ - Get user profile by user ID
module.exports.getUserProfile = function getUserProfile(userId) {
    let sql = `SELECT ud.*, u.singpass_id, u.role,
               (SELECT json_agg(json_build_object('id', r.id, 'file_name', r.file_name)) 
                FROM resume r WHERE r.user_id = u.id) as resumes
               FROM user_detail ud
               JOIN user_ u ON ud.user_id = u.id
               WHERE ud.user_id = $1;`;
    
    return query(sql, [userId]).then(function(result) {
        return result.rows;
    });
}

// READ - Check if user profile exists
module.exports.userProfileExists = function userProfileExists(userId) {
    let sql = "SELECT id FROM user_detail WHERE user_id = $1;";
    return query(sql, [userId]).then(function(result) {
        return result.rows;
    });
}

// UPDATE - Update user profile
module.exports.updateUserProfile = function updateUserProfile(userId, profileData) {
    const { 
        first_name, last_name, phone_number, email,
        linkedin_profile, github_profile
    } = profileData;
    
    let sql = `UPDATE user_detail 
               SET first_name = COALESCE($1, first_name),
                   last_name = COALESCE($2, last_name),
                   phone_number = COALESCE($3, phone_number),
                   email = COALESCE($4, email),
                   linkedin_profile = COALESCE($5, linkedin_profile),
                   github_profile = COALESCE($6, github_profile)
               WHERE user_id = $7
               RETURNING *;`;
    
    return query(sql, [
        first_name, last_name, phone_number, email,
        linkedin_profile, github_profile, userId
    ]).then(function(result) {
        return result.rows;
    });
}

// UPDATE - Update profile photo
module.exports.updateProfilePhoto = function updateProfilePhoto(userId, fileName, fileData) {
    const photoData = fileData ? Buffer.from(fileData, 'base64') : Buffer.from('');
    const photoName = fileName || '';
    
    let sql = `UPDATE user_detail 
               SET profile_picture_file_name = $1, 
                   profile_picture_file_data = $2
               WHERE user_id = $3
               RETURNING id, user_id, profile_picture_file_name;`;
    
    return query(sql, [photoName, photoData, userId]).then(function(result) {
        return result.rows;
    });
}

// DELETE - Delete profile photo
module.exports.deleteProfilePhoto = function deleteProfilePhoto(userId) {
    let sql = `UPDATE user_detail 
               SET profile_picture_file_name = NULL, 
                   profile_picture_file_data = NULL
               WHERE user_id = $1
               RETURNING id;`;
    
    return query(sql, [userId]).then(function(result) {
        return result.rows;
    });
}