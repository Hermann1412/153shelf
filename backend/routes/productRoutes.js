const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, readBook } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

const bookUpload = upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'pdf', maxCount: 1 },
]);

router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/:id/read', protect, readBook);
router.post('/', protect, admin, bookUpload, createProduct);
router.put('/:id', protect, admin, bookUpload, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
