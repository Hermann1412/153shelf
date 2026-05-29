const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    coverImage: { type: String, default: '' },   // publicly accessible
    pdfPath: { type: String, default: '' },       // served only via protected route
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    pages: { type: Number, default: 0 },
    language: { type: String, default: 'English' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
