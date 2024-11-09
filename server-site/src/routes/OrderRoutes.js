const express = require('express');
const router = express.Router();
const axios = require('axios'); // To send HTTP requests to Zapier

// POST request to create a new order
router.post('/api/orders', async (req, res) => {
  const { userEmail, chefEmail, paymentStatus, items, totalPrice } = req.body;

  if (!userEmail || !items || items.length === 0 || !totalPrice) {
    return res.status(400).json({ error: 'User email, items, and total price are required' });
  }

  try {
    // Create a new order object (without using Mongoose here)
    const newOrder = {
      userEmail,
      chefEmail,
      paymentStatus: paymentStatus || 'pending',  // Default to 'pending' if no payment status is provided
      items,
      totalPrice,
      createdAt: new Date(),
    };

    // Simulate saving the order (since we're not using Mongoose)
    // In a real scenario, you might save this data in your database
    const savedOrder = newOrder;  // We directly assign newOrder as the savedOrder for this example

    // Check if payment status is 'successful'
    if (paymentStatus === 'success') {
      // Send order data to Zapier Webhook
      const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/20636785/25h17fq/';  // Replace with your Zapier webhook URL
      const zapierPayload = {
        userEmail: savedOrder.userEmail,
        chefEmail: savedOrder.chefEmail,
        items: savedOrder.items,
        totalPrice: savedOrder.totalPrice,
        createdAt: savedOrder.createdAt,
      };

      // Send the POST request to Zapier
      await axios.post(zapierWebhookUrl, zapierPayload);
    }

    return res.status(201).json({
      message: 'Order placed successfully',
      data: savedOrder,
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// GET request to fetch all orders (Note: This is a placeholder for your actual database query)
router.get('/api/orders', async (req, res) => {
  try {
    // Simulate fetching orders (this would normally come from your database)
    const orders = [
      { userEmail: 'test@example.com', items: [{ name: 'Burger', price: 10 }], totalPrice: 20 },
      { userEmail: 'another@example.com', items: [{ name: 'Pizza', price: 15 }], totalPrice: 30 },
    ];
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving orders', error });
  }
});

// DELETE request to delete an order by ID (Placeholder for your actual database query)
router.delete('/api/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    // In a real scenario, delete the order from your database using the order ID
    const deletedOrder = { orderId, message: 'Order deleted successfully' };

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
