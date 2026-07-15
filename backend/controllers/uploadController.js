const cloudinary = require('../config/cloudinary');
const { v4: uuidv4 } = require('uuid');

// Upload company logo
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

// Upload company banner
module.exports.uploadCompanyBanner = (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        cloudinary.uploader.upload(dataURI, {
            folder: 'company-banners',
            public_id: uuidv4(),
            transformation: [
                { width: 1200, height: 400, crop: 'limit' },
                { quality: 'auto' }
            ]
        }, function(error, result) {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to upload image' });
            }
            
            res.status(201).json({
                message: 'Banner uploaded successfully',
                banner_url: result.secure_url,
                banner_file_name: result.public_id.split('/').pop(),
                banner_file_data: req.file.buffer.toString('base64')
            });
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

// Upload company profile image
module.exports.uploadCompanyProfile = (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        cloudinary.uploader.upload(dataURI, {
            folder: 'company-profiles',
            public_id: uuidv4(),
            transformation: [
                { width: 200, height: 200, crop: 'limit' },
                { quality: 'auto' }
            ]
        }, function(error, result) {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to upload image' });
            }
            
            res.status(201).json({
                message: 'Profile image uploaded successfully',
                profile_url: result.secure_url,
                profile_file_name: result.public_id.split('/').pop(),
                profile_file_data: req.file.buffer.toString('base64')
            });
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};