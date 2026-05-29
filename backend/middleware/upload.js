const multer = require('multer');

// Files are kept in memory and uploaded to Cloudinary in the controller
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'pdf' && file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files allowed for books'));
    }
    if (file.fieldname === 'cover' && !file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files allowed for covers'));
    }
    cb(null, true);
  },
});

module.exports = upload;
