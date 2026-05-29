const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  coverImage: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true, default: 0 },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'paid',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'completed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
