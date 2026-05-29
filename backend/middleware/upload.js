const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = file.fieldname === 'pdf'
      ? path.join(__dirname, '../uploads/pdfs')
      : path.join(__dirname, '../uploads/covers');
    ensureDir(dir);
    cb(null, dir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'pdf' && file.mimetype !== 'application/pdf') {
    return cb(new Error('Only PDF files allowed for books'));
  }
  if (file.fieldname === 'cover' && !file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files allowed for covers'));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});

module.exports = upload;
