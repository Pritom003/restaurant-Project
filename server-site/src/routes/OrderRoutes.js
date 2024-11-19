const express = require('express');
const router = express.Router();
const Order = require('../models/OrderScheema'); // Adjust path as needed
const axios = require('axios');

// POST request to create a new order
router.post('/api/orders', async (req, res) => {
  const { userEmail, chefEmail, paymentStatus, paymentMethod, items, totalPrice } = req.body;

  if (!userEmail || !items || items.length === 0 || !totalPrice) {
    return res.status(400).json({ error: 'User email, items, and total price are required' });
  }

  try {
    // Create a new order document
    const newOrder = new Order({
      userEmail,
      chefEmail,
      paymentStatus,
      paymentMethod,
      items,
      totalPrice,
    });

    const savedOrder = await newOrder.save();

    // If payment is successful, send data to Zapier
    if (paymentStatus === 'success' || paymentStatus === 'pending') {
      const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/20636785/25h17fq/';
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
router.patch('/api/orders/:id/payment-status', async (req, res) => {
  try {
    const orderId = req.params.id;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: 'success' },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Notify Zapier of the status update
    const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/20636785/25h17fq/';
    const zapierPayload = {
      userEmail: updatedOrder.userEmail,
      chefEmail: updatedOrder.chefEmail,
      items: updatedOrder.items,
      totalPrice: updatedOrder.totalPrice,
      paymentStatus: updatedOrder.paymentStatus,
      createdAt: updatedOrder.createdAt,
    };
    await axios.post(zapierWebhookUrl, zapierPayload);

    res.status(200).json({
      message: 'Payment status updated successfully',
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});
// GET request to fetch payment method statistics (Cash on Delivery vs Stripe)


// GET request to fetch payment method statistics (Cash on Delivery vs Stripe)
router.get('/api/orders/payment-methods', async (req, res) => {
  try {
    // Aggregate data by paymentMethod
    const paymentStats = await Order.aggregate([
      {
        $group: {
          _id: "$paymentMethod", // Group by paymentMethod (e.g., "Cash", "Stripe")
          count: { $sum: 1 },   // Count the number of orders per payment method
        },
      },
    ]);

    res.status(200).json(paymentStats);
  } catch (error) {
    console.error('Error fetching payment method statistics:', error);
    res.status(500).json({ message: 'Failed to retrieve payment method statistics', error });
  }
});



router.get('/api/orders/:email', async (req, res) => {
  try {
    const { email: userEmail } = req.params; // Extract the email from params
    const result = await Order.find({ userEmail }); // Query using userEmail field
    if (!result.length) {
      return res.status(404).json({ message: 'No orders found for this email' });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ message: 'Error retrieving orders', error });
  }
});



module.exports = router;
