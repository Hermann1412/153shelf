const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const Order = require('../models/Order');

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
      .select('-pdfPath')
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
    const product = await Product.findById(req.params.id).select('-pdfPath');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { title, author, description, price, category, pages, language } = req.body;
    if (!title || !author || !description || !price || !category) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    const coverImage = req.files?.cover
      ? `/uploads/covers/${req.files.cover[0].filename}`
      : '';
    const pdfPath = req.files?.pdf
      ? req.files.pdf[0].path
      : '';

    const product = await Product.create({
      title, author, description,
      price: parseFloat(price),
      category, coverImage, pdfPath,
      pages: parseInt(pages) || 0,
      language: language || 'English',
    });
    res.status(201).json({ ...product.toObject(), pdfPath: undefined });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const fields = ['title', 'author', 'description', 'price', 'category', 'pages', 'language'];
    fields.forEach((f) => { if (req.body[f] !== undefined) product[f] = req.body[f]; });

    if (req.files?.cover) {
      product.coverImage = `/uploads/covers/${req.files.cover[0].filename}`;
    }
    if (req.files?.pdf) {
      product.pdfPath = req.files.pdf[0].path;
    }

    const updated = await product.save();
    const obj = updated.toObject();
    delete obj.pdfPath;
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.pdfPath && fs.existsSync(product.pdfPath)) fs.unlinkSync(product.pdfPath);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Protected: only buyers can access the PDF
const readBook = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Book not found' });
    if (!product.pdfPath) return res.status(404).json({ message: 'No PDF available for this book' });

    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'items.product': product._id,
      paymentStatus: 'paid',
    });

    if (!hasPurchased && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Purchase this book to read it' });
    }

    const filePath = path.resolve(product.pdfPath);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'PDF file not found' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${product.title}.pdf"`);
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, readBook };
