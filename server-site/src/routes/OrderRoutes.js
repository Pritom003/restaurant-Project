const express = require('express');
const router = express.Router();
const Order = require('../models/OrderScheema'); // Adjust path as needed
const axios = require('axios');

// POST request to create a new order
router.post('/api/orders', async (req, res) => {
  const { userEmail, chefEmail, paymentStatus, items, totalPrice } = req.body;

  if (!userEmail || !items || items.length === 0 || !totalPrice) {
    return res.status(400).json({ error: 'User email, items, and total price are required' });
  }

  try {
    // Create a new order document
    const newOrder = new Order({
      userEmail,
      chefEmail,
      paymentStatus: paymentStatus ,
      items,
      totalPrice,
    });

    const savedOrder = await newOrder.save();

    // If payment is successful, send data to Zapier
    if (paymentStatus === 'success') {
      const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/20636785/25h17fq/'; // Replace with your Zapier URL
      const zapierPayload = {
        userEmail: savedOrder.userEmail,
        chefEmail: savedOrder.chefEmail,
        items: savedOrder.items,
        totalPrice: savedOrder.totalPrice,
        createdAt: savedOrder.createdAt,
      };
      await axios.post(zapierWebhookUrl, zapierPayload);
    }

    res.status(201).json({
      message: 'Order placed successfully',
      data: savedOrder,
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// GET request to fetch all orders
router.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ message: 'Error retrieving orders', error });
  }
});

// DELETE request to delete an order by ID
router.delete('/api/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order deleted successfully',
      data: deletedOrder,
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

module.exports = router;