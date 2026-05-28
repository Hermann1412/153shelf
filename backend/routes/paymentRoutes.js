const express = require('express');
const { createPaymentIntent, handleWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create-intent', protect, createPaymentIntent);
router.post('/webhook', handleWebhook);

module.exports = router;
