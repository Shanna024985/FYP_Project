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
        linkedin_profile, github_profile, profile_picture_file_url, default_resume_id
    } = profileData;
    
    let sql = `INSERT INTO user_detail(
        user_id, first_name, last_name, phone_number, email,
        linkedin_profile, github_profile, profile_picture_file_url, default_resume_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
    RETURNING id, user_id, first_name, last_name, phone_number, email,
              linkedin_profile, github_profile, profile_picture_file_url, default_resume_id;`;
    
    return query(sql, [
        user_id, 
        first_name, 
        last_name, 
        phone_number || '', 
        email,
        linkedin_profile || '', 
        github_profile || '',
        profile_picture_file_url || '',
        default_resume_id || null
    ]).then(function(result) {
        return result.rows;
    });
}

// READ - Get user profile by user ID
module.exports.getUserProfile = function getUserProfile(userId) {
    let sql = `SELECT ud.id, ud.user_id, ud.first_name, ud.last_name, 
                      ud.phone_number, ud.email, ud.linkedin_profile, ud.github_profile,
                      ud.profile_picture_file_url as profile_picture_url,
                      ud.default_resume_id,
                      u.singpass_id, u.google_id, u.role,
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
    let sql = "SELECT d.id, u.google_email FROM user_detail d JOIN user_ u on d.user_id = u.id WHERE user_id = $1;";
    return query(sql, [userId]).then(function(result) {
        return result.rows;
    });
}

// UPDATE - Update user profile
module.exports.updateUserProfile = function updateUserProfile(userId, profileData) {
    const { 
        first_name, last_name, phone_number, email,
        linkedin_profile, github_profile, profile_picture_file_url, default_resume_id
    } = profileData;
    
    let sql = `UPDATE user_detail 
               SET first_name = COALESCE($1, first_name),
                   last_name = COALESCE($2, last_name),
                   phone_number = COALESCE($3, phone_number),
                   email = COALESCE($4, email),
                   linkedin_profile = COALESCE($5, linkedin_profile),
                   github_profile = COALESCE($6, github_profile),
                   profile_picture_file_url = COALESCE($7, profile_picture_file_url),
                   default_resume_id = COALESCE($8, default_resume_id)
               WHERE user_id = $9
               RETURNING id, user_id, first_name, last_name, phone_number, email,
                         linkedin_profile, github_profile, profile_picture_file_url, default_resume_id;`;
    
    return query(sql, [
        first_name, 
        last_name, 
        phone_number, 
        email,
        linkedin_profile, 
        github_profile,
        profile_picture_file_url,
        default_resume_id,
        userId
    ]).then(function(result) {
        return result.rows;
    });
}

// UPDATE - Update profile photo URL
module.exports.updateProfilePhotoUrl = function updateProfilePhotoUrl(userId, profilePictureUrl) {
    let sql = `UPDATE user_detail 
               SET profile_picture_file_url = $1
               WHERE user_id = $2
               RETURNING id, user_id, profile_picture_file_url;`;
    
    return query(sql, [profilePictureUrl, userId]).then(function(result) {
        return result.rows;
    });
}

// DELETE - Delete profile photo
module.exports.deleteProfilePhoto = function deleteProfilePhoto(userId) {
    let sql = `UPDATE user_detail 
               SET profile_picture_file_url = NULL
               WHERE user_id = $1
               RETURNING id;`;
    
    return query(sql, [userId]).then(function(result) {
        return result.rows;
    });
}

// ==================== USER PROFILE - LEGACY (DEPRECATED) ====================

// UPDATE - Update profile photo (OLD - uses binary data)
module.exports.updateProfilePhoto = function updateProfilePhoto(userId, fileName, fileData) {
    const photoData = fileData ? Buffer.from(fileData, 'base64') : Buffer.from('');
    const photoName = fileName || '';
    
    let sql = `UPDATE user_detail 
               SET profile_picture_file_name = $1, 
                   profile_picture_file_data = $2,
                   profile_picture_file_url = $4
               WHERE user_id = $3
               RETURNING id, user_id, profile_picture_file_name;`;
    
    return query(sql, [photoName, photoData, userId, fileUrl]).then(function(result) {
        return result.rows;
    });
}

// DELETE - Delete profile photo (OLD)
module.exports.deleteProfilePhotoOld = function deleteProfilePhotoOld(userId) {
    let sql = `UPDATE user_detail 
               SET profile_picture_file_name = NULL, 
                   profile_picture_file_data = NULL
               WHERE user_id = $1
               RETURNING id;`;
    
    return query(sql, [userId]).then(function(result) {
        return result.rows;
    });
}

// Create new user based on google email
// When setting user details, google can also be used to log in (and also link with singpass)
module.exports.insertNewUserByGoogleId = (googleId, googleEmail) => {
    let sql = "INSERT INTO user_ (google_id, google_email) VALUES ($1, $2) RETURNING id;";
    return query(sql, [googleId, googleEmail]).then(function (result) {
        return result.rows;
    });
}

module.exports.getUserByGoogleId = (googleId) => {
    let sql = "SELECT * FROM user_ u WHERE google_id = $1;";
    return query(sql, [googleId]).then(function (result) {
        return result.rows;
    });
}

module.exports.linkSingpassIdById = (singpassId, id) => {
    let sql = "UPDATE user_ SET singpass_id = $1 WHERE id = $2 RETURNING id;";
    return query(sql, [singpassId, id]).then(function (result) {
        return result.rows;
    });
}

module.exports.linkGoogleIdById = (googleId, id) => {
    let sql = "UPDATE user_ SET google_id = $1 WHERE id = $2 RETURNING id;";
    return query(sql, [googleId, id]).then(function (result) {
        return result.rows;
    });
}

module.exports.unlinkSingpassIdById = (id) => {
    let sql = "UPDATE user_ SET singpass_id = NULL WHERE id = $1 RETURNING id;";
    return query(sql, [id]).then(function (result) {
        return result.rows;
    });
}

module.exports.unlinkGoogleIdById = (id) => {
    let sql = "UPDATE user_ SET google_id = NULL WHERE id = $1 RETURNING id;";
    return query(sql, [id]).then(function (result) {
        return result.rows;
    });
}

module.exports.getUserById = (id) => {
    let sql = "SELECT * FROM user_ u WHERE id = $1;";
    return query(sql, [id]).then(function (result) {
        return result.rows;
    });
}

module.exports.updateGoogleEmailById = (googleEmail, id) => {
    let sql = "UPDATE user_ SET google_email = $1 WHERE id = $2;";
    return query(sql, [googleEmail, id]).then(function (result) {
        return result.rows;
    });
}