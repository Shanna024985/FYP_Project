const multer = require('multer');
const path = require('path');

// Configure storage (memory storage for Cloudinary upload)
const storage = multer.memoryStorage();

// File filter for validation - supports images AND documents
const fileFilter = (req, file, cb) => {
    // Allowed file types (images + documents)
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, jpg, png, gif, webp) and documents (PDF, DOC, DOCX) are allowed'));
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: { 
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

module.exports = upload;