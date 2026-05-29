const Order = require('../models/Order');

const createOrder = async (req, res) => {
  try {
    const { items, totalPrice } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }
    const order = await Order.create({
      user: req.user._id,
      items,
      totalPrice: totalPrice || 0,
      paymentStatus: 'paid',
      status: 'completed',
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'title coverImage')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'title coverImage')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (status) order.status = status;
    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
