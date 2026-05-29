const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    coverImage: { type: String, default: '' },      // Cloudinary secure URL
    coverPublicId: { type: String, default: '' },   // for deletion
    pdfPublicId: { type: String, default: '' },     // Cloudinary private raw ID
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    pages: { type: Number, default: 0 },
    language: { type: String, default: 'English' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
