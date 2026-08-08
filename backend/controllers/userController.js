const userModel = require("../models/userModel");
const cloudinary = require("../config/cloudinary");
const { v4: uuidv4 } = require("uuid");

// Helper: Get user ID from request
const getUserIdFromReq = (req, res) => {
    return res?.locals?.userId || req.user?.userId || req.user?.id;
};

// ==================== USER PROFILE CONTROLLERS ====================

// CREATE - Create user profile
module.exports.createUserProfile = (req, res, next) => {
    const userId = getUserIdFromReq(req, res);

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

    const {
        first_name,
        last_name,
        phone_number,
        email,
        linkedin_profile,
        github_profile,
        profile_picture_file_url,
        default_resume_id,
    } = req.body;

    if (!first_name || !last_name || !email) {
        return res.status(400).json({
            error: "First name, last name, and email are required",
        });
    }

    return userModel
        .userProfileExists(userId)
        .then(function (existing) {
            if (existing.length > 0) {
                return res.status(400).json({
                    error: "Profile already exists. Use PUT to update.",
                });
            }

            return userModel
                .createUserProfile({
                    user_id: userId,
                    first_name,
                    last_name,
                    phone_number: phone_number || "",
                    email,
                    linkedin_profile: linkedin_profile || "",
                    github_profile: github_profile || "",
                    profile_picture_file_url: profile_picture_file_url || "",
                    default_resume_id: default_resume_id || null,
                })
                .then(function (profile) {
                    res.status(201).json({
                        message: "User profile created successfully",
                        profile: profile[0],
                    });
                });
        })
        .catch(function (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
};

// READ - Get user profile
module.exports.getUserProfile = (req, res, next) => {
    const userId = getUserIdFromReq(req, res);

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

    return userModel
        .getUserProfile(userId)
        .then(function (profile) {
            if (profile.length === 0) {
                return res.status(404).json({
                    error: "User profile not found",
                });
            }

            const userProfile = profile[0];
            
            // Return profile with URL format (no binary data)
            res.json({
                profile: {
                    id: userProfile.id,
                    user_id: userProfile.user_id,
                    first_name: userProfile.first_name,
                    last_name: userProfile.last_name,
                    phone_number: userProfile.phone_number,
                    email: (userProfile.googleEmail) ? userProfile.googleEmail : userProfile.email,
                    linkedin_profile: userProfile.linkedin_profile,
                    github_profile: userProfile.github_profile,
                    profile_picture_url: userProfile.profile_picture_url || null,
                    default_resume_id: userProfile.default_resume_id,
                    is_linked_with_singpass: (userProfile.singpass_id) ? true : false,
                    is_linked_with_google: (userProfile.google_id) ? true : false
                }
            });
        })
        .catch(function (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
};

// UPDATE - Update user profile
module.exports.updateUserProfile = (req, res, next) => {
    const userId = getUserIdFromReq(req, res);

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

    const {
        first_name,
        last_name,
        phone_number,
        email,
        linkedin_profile,
        github_profile,
        profile_picture_file_url,
        default_resume_id,
    } = req.body;

    return userModel
        .userProfileExists(userId)
        .then(function (existing) {
            if (existing.length === 0) {
                return res.status(404).json({
                    error: "User profile not found. Please create profile first.",
                });
            }

            return userModel
                .updateUserProfile(userId, {
                    first_name,
                    last_name,
                    phone_number,
                    email: (existing[0].google_email) ? existing[0].google_email : email,
                    linkedin_profile,
                    github_profile,
                    profile_picture_file_url,
                    default_resume_id,
                })
                .then(function (updated) {
                    if (updated.length === 0) {
                        return res.status(404).json({
                            error: "User profile not found",
                        });
                    }
                    res.json({
                        message: "User profile updated successfully",
                        profile: {
                            id: updated[0].id,
                            user_id: updated[0].user_id,
                            first_name: updated[0].first_name,
                            last_name: updated[0].last_name,
                            phone_number: updated[0].phone_number,
                            email: updated[0].email,
                            linkedin_profile: updated[0].linkedin_profile,
                            github_profile: updated[0].github_profile,
                            profile_picture_url: updated[0].profile_picture_file_url || null,
                            default_resume_id: updated[0].default_resume_id,
                        }
                    });
                });
        })
        .catch(function (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
};

// UPDATE - Upload profile photo
module.exports.uploadProfilePhoto = (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const userId = getUserIdFromReq(req, res);

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: User not authenticated" });
        }

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
        ];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                error: "Only image files are allowed (jpeg, jpg, png, gif, webp)",
            });
        }

        if (req.file.size > 5 * 1024 * 1024) {
            return res.status(400).json({
                error: "File size must be less than 5MB",
            });
        }

        return userModel
            .userProfileExists(userId)
            .then(function (existing) {
                if (existing.length === 0) {
                    return res.status(404).json({
                        error: "User profile not found. Please create profile first.",
                    });
                }

                const b64 = Buffer.from(req.file.buffer).toString("base64");
                const dataURI = `data:${req.file.mimetype};base64,${b64}`;

                cloudinary.uploader.upload(
                    dataURI,
                    {
                        folder: "profile-photos",
                        public_id: uuidv4(),
                        transformation: [
                            { width: 500, height: 500, crop: "limit" },
                            { quality: "auto" },
                        ],
                    },
                    function (error, result) {
                        if (error) {
                            console.error("Cloudinary upload error:", error);
                            return res.status(500).json({
                                error: "Failed to upload profile photo to Cloudinary",
                            });
                        }

                        const profilePictureUrl = result.secure_url;

                        return userModel
                            .updateProfilePhotoUrl(userId, profilePictureUrl)
                            .then(function (updated) {
                                if (updated.length === 0) {
                                    return res.status(404).json({
                                        error: "User profile not found",
                                    });
                                }
                                res.status(201).json({
                                    message: "Profile photo uploaded successfully",
                                    profile: {
                                        id: updated[0].id,
                                        user_id: updated[0].user_id,
                                        profile_picture_url: updated[0].profile_picture_file_url,
                                    },
                                });
                            })
                            .catch(function (dbError) {
                                console.error("Database error:", dbError);
                                return res.status(500).json({
                                    error: "Failed to save profile photo to database",
                                });
                            });
                    }
                );
            })
            .catch(function (error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            });
    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ error: error.message });
    }
};

// DELETE - Delete profile photo
module.exports.deleteProfilePhoto = (req, res, next) => {
    const userId = getUserIdFromReq(req, res);

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

    return userModel
        .userProfileExists(userId)
        .then(function (existing) {
            if (existing.length === 0) {
                return res.status(404).json({
                    error: "User profile not found",
                });
            }

            return userModel.deleteProfilePhoto(userId).then(function (deleted) {
                res.json({
                    message: "Profile photo deleted successfully",
                    userId: userId,
                });
            });
        })
        .catch(function (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
};