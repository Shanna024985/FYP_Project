const cloudinary = require('../config/cloudinary');
const { v4: uuidv4 } = require('uuid');

// Upload company logo (returns binary data for database)
module.exports.uploadCompanyLogo = (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        cloudinary.uploader.upload(dataURI, {
            folder: 'company-logos',
            public_id: uuidv4(),
            transformation: [
                { width: 500, height: 500, crop: 'limit' },
                { quality: 'auto' }
            ]
        }, function(error, result) {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to upload image' });
            }
            
            // Return both the URL and the file data
            res.status(201).json({
                message: 'Logo uploaded successfully',
                logo_url: result.secure_url,
                logo_file_name: result.public_id.split('/').pop(),
                logo_file_data: req.file.buffer.toString('base64')
            });
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};