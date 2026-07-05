const { query } = require("../services/dbConnection");
const cloudinary = require('../config/cloudinary');
const { v4: uuidv4 } = require('uuid');

// UPLOAD - Upload a resume
module.exports.uploadResume = (req, res, next) => {
    try {
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Get userId from request body or use default
        const userId = res.locals.userId;

        // Validate file type - allow PDF, DOC, DOCX
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ 
                error: 'Only PDF, DOC, and DOCX files are allowed' 
            });
        }

        // Validate file size (max 5MB)
        if (req.file.size > 5 * 1024 * 1024) {
            return res.status(400).json({ 
                error: 'File size must be less than 5MB' 
            });
        }

        // Convert file to base64 for Cloudinary upload
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        // Upload to Cloudinary
        cloudinary.uploader.upload(dataURI, {
            folder: 'resumes',
            public_id: uuidv4(),
            resource_type: 'auto',
            format: 'pdf'
        }, function(error, result) {
            if (error) {
                console.error('Cloudinary upload error:', error);
                return res.status(500).json({ 
                    error: 'Failed to upload resume to Cloudinary' 
                });
            }

            // Save resume to database
            // const sql = `INSERT INTO resume (user_id, file_name, file_data) 
            //              VALUES ($1, $2, $3) RETURNING *;`;

            // Store file_data as base64 for database
            const fileData = req.file.buffer;
            const fileName = req.file.originalname;

            // Check if user already has a default resume
            const checkSql = `
    SELECT COUNT(*) AS total
    FROM resume
    WHERE user_id = $1;
`;

            query(checkSql, [userId])
                .then((countResult) => {
                    const isDefault = Number(countResult.rows[0].total) === 0;

                    const insertSql = `
            INSERT INTO resume
            (user_id, file_name, file_data, is_default)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

                    return query(insertSql, [
                        userId,
                        fileName,
                        fileData,
                        isDefault
                    ]);
                })
                .then(function (dbResult) {
                    res.status(201).json({
                        message: 'Resume uploaded successfully',
                        resume: {
                            id: dbResult.rows[0].id,
                            file_name: dbResult.rows[0].file_name,
                            file_url: result.secure_url
                        }
                    });
                }).catch(function(dbError) {
                    console.error('Database error:', dbError);
                    return res.status(500).json({ 
                        error: 'Failed to save resume to database' 
                    });
                });
        });

    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: error.message });
    }
};

// READ - Get all resumes for a user
module.exports.getResumesByUser = (req, res, next) => {
    const userId = res.locals.userId;

    let sql = `SELECT id, user_id, file_name, file_data, is_default
               FROM resume 
               WHERE user_id = $1 
               ORDER BY id DESC;`;
    
    return query(sql, [userId])
        .then(function(result) {
            // Convert file_data to base64 for frontend display
            const resumes = result.rows.map(function(row) {
                return {
                    id: row.id,
                    user_id: row.user_id,
                    file_name: row.file_name,
                    file_data: row.file_data ? row.file_data.toString('base64') : null,
                    is_default: row.is_default
                };
            });
            
            res.json({ 
                count: resumes.length, 
                resumes: resumes 
            });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
};

// READ - Get a specific resume by ID
module.exports.getResumeById = (req, res, next) => {
    let resumeId = req.params.id;
    const userId = res.locals.userId;

    let sql = `SELECT id, user_id, file_name, file_data, is_default
               FROM resume 
               WHERE id = $1 AND user_id = $2;`;
    
    return query(sql, [resumeId, userId])
        .then(function(result) {
            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Resume not found" });
            }
            
            // Convert file_data to base64 for frontend
            const resume = {
                id: result.rows[0].id,
                user_id: result.rows[0].user_id,
                file_name: result.rows[0].file_name,
                file_data: result.rows[0].file_data ? result.rows[0].file_data.toString('base64') : null,
                is_default: result.rows[0].is_default
            };
            
            res.json({ resume: resume });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
};

// DELETE - Delete a resume
// module.exports.deleteResume = (req, res, next) => {
//     let resumeId = req.params.id;
//     const userId = res.locals.userId;

//     let sql = `DELETE FROM resume 
//                WHERE id = $1 AND user_id = $2 
//                RETURNING id;`;
    
//     return query(sql, [resumeId, userId])
//         .then(function(result) {
//             if (result.rows.length === 0) {
//                 return res.status(404).json({ 
//                     error: "Resume not found or you don't own it" 
//                 });
//             }
//             res.json({ 
//                 message: "Resume deleted successfully", 
//                 deletedId: result.rows[0].id 
//             });
//         }).catch(function(error) {
//             console.error(error);
//             return res.status(500).json({ error: error.message });
//         });
// };
module.exports.deleteResume = async (req, res, next) => {
    const resumeId = req.params.id;
    const userId = res.locals.userId;

    try {
        // Find the resume first
        const checkResult = await query(
            `SELECT is_default
             FROM resume
             WHERE id = $1
             AND user_id = $2;`,
            [resumeId, userId]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                error: "Resume not found or you don't own it"
            });
        }

        const wasDefault = checkResult.rows[0].is_default;

        // Delete it
        await query(
            `DELETE FROM resume
             WHERE id = $1
             AND user_id = $2;`,
            [resumeId, userId]
        );

        // If it was the default, assign another one
        if (wasDefault) {
            const nextResume = await query(
                `SELECT id
                 FROM resume
                 WHERE user_id = $1
                 ORDER BY id DESC
                 LIMIT 1;`,
                [userId]
            );

            if (nextResume.rows.length > 0) {
                await query(
                    `UPDATE resume
                     SET is_default = TRUE
                     WHERE id = $1;`,
                    [nextResume.rows[0].id]
                );
            }
        }

        res.json({
            message: "Resume deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
};

// UPDATE - Set a resume as the default
module.exports.setDefaultResume = async (req, res, next) => {
    const resumeId = req.params.id;
    const userId = res.locals.userId;

    try {
        // Check if the resume belongs to the user
        const checkSql = `
            SELECT id
            FROM resume
            WHERE id = $1
            AND user_id = $2;
        `;

        const checkResult = await query(checkSql, [resumeId, userId]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                error: "Resume not found."
            });
        }

        // Remove current default
        await query(
            `UPDATE resume
             SET is_default = FALSE
             WHERE user_id = $1;`,
            [userId]
        );

        // Set selected resume as default
        await query(
            `UPDATE resume
             SET is_default = TRUE
             WHERE id = $1
             AND user_id = $2;`,
            [resumeId, userId]
        );

        res.json({
            message: "Default resume updated successfully."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
};
