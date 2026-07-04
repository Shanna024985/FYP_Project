const userModel = require("../models/userModel");
const cloudinary = require("../config/cloudinary");
const { v4: uuidv4 } = require("uuid");

// ==================== USER PROFILE CONTROLLERS ====================

// CREATE - Create user profile
module.exports.createUserProfile = (req, res, next) => {
  const userId = res.locals.userId;

  const {
    first_name,
    last_name,
    phone_number,
    email,
    linkedin_profile,
    github_profile,
  } = req.body;

  if (!first_name || !last_name || !phone_number || !email) {
    return res.status(400).json({
      error: "First name, last name, phone number, and email are required",
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
          phone_number,
          email,
          linkedin_profile: linkedin_profile || "",
          github_profile: github_profile || "",
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
  let userId = req.query.userId || 1;

  return userModel
    .getUserProfile(userId)
    .then(function (profile) {
      if (profile.length === 0) {
        return res.status(404).json({
          error: "User profile not found",
        });
      }

      const userProfile = profile[0];
      if (userProfile.profile_picture_file_data) {
        userProfile.profile_picture_file_data =
          userProfile.profile_picture_file_data.toString("base64");
      }

      res.json({ profile: userProfile });
    })
    .catch(function (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    });
};

// UPDATE - Update user profile
module.exports.updateUserProfile = (req, res, next) => {
  let {
    userId,
    first_name,
    last_name,
    phone_number,
    email,
    linkedin_profile,
    github_profile,
  } = req.body;

  userId = userId || 1;

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
          email,
          linkedin_profile,
          github_profile,
        })
        .then(function (updated) {
          if (updated.length === 0) {
            return res.status(404).json({
              error: "User profile not found",
            });
          }
          res.json({
            message: "User profile updated successfully",
            profile: updated[0],
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

    const userId = req.body.userId || 1;

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
              { width: 200, height: 200, crop: "limit" },
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

            const fileName = result.public_id.split("/").pop();
            const fileData = req.file.buffer.toString("base64");

            return userModel
              .updateProfilePhoto(userId, fileName, fileData)
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
                    profile_picture_file_name:
                      updated[0].profile_picture_file_name,
                    profile_picture_url: result.secure_url,
                  },
                });
              })
              .catch(function (dbError) {
                console.error("Database error:", dbError);
                return res.status(500).json({
                  error: "Failed to save profile photo to database",
                });
              });
          },
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
  let userId = req.body.userId || 1;

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
