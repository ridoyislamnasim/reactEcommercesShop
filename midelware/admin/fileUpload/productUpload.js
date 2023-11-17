// import multer from '
// import path from 'path';
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 4 * 1024 * 1024 }, // 4 MB limit
    fileFilter: function (req, file, cb) {
        const allowedFileTypes = /jpeg|jpg|png|gif/;
        const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedFileTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb('Error: Only images (jpeg/jpg/png/gif) are allowed!');
        }
    }
}).single('image');

const uploadMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            // Handle file size limit exceeded error
            if (err.message === 'File too large') {
                return res.status(400).json({ error: 'File size exceeds the limit of 4 MB.' });
            }

            // Handle other errors
            return res.status(400).json({ error: err.message });
        } else {
            // No error, continue to the next middleware
            next();
        }
    });
};

module.exports = uploadMiddleware;


