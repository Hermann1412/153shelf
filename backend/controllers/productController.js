const https = require('https');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

// Upload a buffer to Cloudinary and return the result
const streamToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (result) resolve(result);
      else reject(err);
    });
    stream.end(buffer);
  });

const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { author: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .select('-pdfPublicId -coverPublicId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json({ products, page, pages: Math.ceil(total / limit), total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('-pdfPublicId -coverPublicId');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { title, author, description, category, pages, language } = req.body;
    if (!title || !author || !description || !category) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    let coverImage = '';
    let coverPublicId = '';
    let pdfPublicId = '';

    if (req.files?.cover) {
      const result = await streamToCloudinary(req.files.cover[0].buffer, {
        folder: '153shelf/covers',
        resource_type: 'image',
      });
      coverImage = result.secure_url;
      coverPublicId = result.public_id;
    }

    if (req.files?.pdf) {
      const result = await streamToCloudinary(req.files.pdf[0].buffer, {
        folder: '153shelf/pdfs',
        resource_type: 'raw',
        type: 'private',
      });
      pdfPublicId = result.public_id;
    }

    const product = await Product.create({
      title, author, description, category,
      coverImage, coverPublicId, pdfPublicId,
      pages: parseInt(pages) || 0,
      language: language || 'English',
    });

    const obj = product.toObject();
    delete obj.pdfPublicId;
    delete obj.coverPublicId;
    res.status(201).json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const fields = ['title', 'author', 'description', 'category', 'pages', 'language'];
    fields.forEach((f) => { if (req.body[f] !== undefined) product[f] = req.body[f]; });

    if (req.files?.cover) {
      // Delete old cover from Cloudinary
      if (product.coverPublicId) {
        await cloudinary.uploader.destroy(product.coverPublicId, { resource_type: 'image' });
      }
      const result = await streamToCloudinary(req.files.cover[0].buffer, {
        folder: '153shelf/covers',
        resource_type: 'image',
      });
      product.coverImage = result.secure_url;
      product.coverPublicId = result.public_id;
    }

    if (req.files?.pdf) {
      // Delete old PDF from Cloudinary
      if (product.pdfPublicId) {
        await cloudinary.uploader.destroy(product.pdfPublicId, { resource_type: 'raw', type: 'private' });
      }
      const result = await streamToCloudinary(req.files.pdf[0].buffer, {
        folder: '153shelf/pdfs',
        resource_type: 'raw',
        type: 'private',
      });
      product.pdfPublicId = result.public_id;
    }

    const updated = await product.save();
    const obj = updated.toObject();
    delete obj.pdfPublicId;
    delete obj.coverPublicId;
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Clean up Cloudinary resources
    if (product.coverPublicId) {
      await cloudinary.uploader.destroy(product.coverPublicId, { resource_type: 'image' });
    }
    if (product.pdfPublicId) {
      await cloudinary.uploader.destroy(product.pdfPublicId, { resource_type: 'raw', type: 'private' });
    }

    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Protected: any logged-in user can read for free
const readBook = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Book not found' });
    if (!product.pdfPublicId) return res.status(404).json({ message: 'No PDF available for this book' });

    // Generate a short-lived signed URL for the private PDF
    const signedUrl = cloudinary.url(product.pdfPublicId, {
      resource_type: 'raw',
      type: 'private',
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + 300, // valid for 5 minutes
    });

    // Stream the PDF from Cloudinary to the client — keeps the PDF private
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${product.title}.pdf"`);
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    https.get(signedUrl, (cloudRes) => {
      cloudRes.pipe(res);
    }).on('error', () => {
      res.status(500).json({ message: 'Error loading PDF' });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, readBook };
