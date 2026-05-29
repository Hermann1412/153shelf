require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

const seedAdmin = async () => {
  const User = require('./models/User');
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.log('Skipping admin seed: ADMIN_EMAIL or ADMIN_PASSWORD not set');
    return;
  }
  const exists = await User.findOne({ email: ADMIN_EMAIL });
  if (exists) {
    if (exists.role !== 'admin') {
      exists.role = 'admin';
      await exists.save();
      console.log(`Upgraded to admin: ${ADMIN_EMAIL}`);
    } else {
      console.log(`Admin already exists: ${ADMIN_EMAIL}`);
    }
  } else {
    await User.create({ name: ADMIN_NAME || 'Admin', email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' });
    console.log(`Admin created: ${ADMIN_EMAIL}`);
  }
};

connectDB().then(seedAdmin).catch((err) => console.error('Seed error:', err.message));

const app = express();

// CORS — must be first, before every other middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Cookie');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());
app.use(cookieParser());

// Cover images are public — PDFs are NOT exposed as static
app.use('/uploads/covers', express.static(path.join(__dirname, 'uploads/covers')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.json({ message: '153Shelf API running', v: 2 }));

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
