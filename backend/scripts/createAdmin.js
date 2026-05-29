require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const mongoose = require('mongoose');
const User = require('../models/User');

const { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file');
  process.exit(1);
}

const run = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  let user = await User.findOne({ email: ADMIN_EMAIL });

  if (user) {
    user.role = 'admin';
    user.password = ADMIN_PASSWORD;
    await user.save();
    console.log(`Updated to admin: ${ADMIN_EMAIL}`);
  } else {
    await User.create({ name: ADMIN_NAME || 'Admin', email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' });
    console.log(`Created admin: ${ADMIN_EMAIL}`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => { console.error(err.message); process.exit(1); });
