const express = require('express');
const router = express.Router();
const Order = require('../models/OrderScheema'); // Adjust path as needed
const axios = require('axios');
const nodemailer = require("nodemailer");

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

// Function to send a welcome email
const sendWelcomeEmail = async (email, orderNumber, items) => {

  const formattedItems = items
    .map((item, index) => `  ${index + 1}. ${item.name} (x${item.quantity})`)
    .join("\n");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Deedar.UK Restaurant Order Confirmation 🍴",
    text: `Dear Valued Customer,

Thank you for choosing Deedar.UK Restaurant! We are delighted to confirm your order.

Here are your order details:
- **Items Ordered:** ${formattedItems}
- **Order Number:** ${orderNumber}

Your satisfaction is our priority, and we’re working hard to prepare your delicious meal. If you have any questions or need assistance, feel free to contact us.

We look forward to serving you again soon!

Warm regards,  
The Deedar.UK Restaurant Team
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent successfully to ${email}`);
  } catch (error) {
    console.error(`Failed to send welcome email to ${email}:`, error);
  }
};


// API endpoint to place an order
router.post("/api/orders", async (req, res) => {
  const {
    orderNumber,
    userEmail,
    chefEmail,
    paymentStatus,
    paymentMethod,
    items,
    totalPrice,
    orderType,
    spiceLevel,
    email,
    address,
    zipcode,
    mobile,
    area,
    extraCharge,
  } = req.body;

  // Validate required fields
  if (!userEmail || !items || items.length === 0 || !totalPrice) {
    return res.status(400).json({
      error: "User email, items, and total price are required",
    });
  }

  try {
    // Create and save the order
    const newOrder = new Order({
      orderNumber,
      userEmail,
      chefEmail,
      paymentStatus,
      paymentMethod,
      orderType,
      items,
      totalPrice,
      status: "Pending",
      spiceLevel,
      email,
      address,
      zipcode,
      mobile,
      area,
      extraCharge,
    });

    const savedOrder = await newOrder.save();

    // Emit event to all connected clients
    req.io.emit("new-order", savedOrder);

    // Send the welcome email
    await sendWelcomeEmail(email, orderNumber, items);

    // Respond with success
    res.status(201).json({
      message: "Order placed successfully",
      data: savedOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Failed to place order" });
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
    // const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/20636785/25h17fq/';
    // const zapierPayload = {
    //   userEmail: updatedOrder.userEmail,
    //   chefEmail: updatedOrder.chefEmail,
    //   items: updatedOrder.items,
    //   totalPrice: updatedOrder.totalPrice,
    //   paymentStatus: updatedOrder.paymentStatus,
    //   createdAt: updatedOrder.createdAt,
    // };
    // await axios.post(zapierWebhookUrl, zapierPayload);

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
router.get('/api/orders/payment-methods', async (req, res) => {
  try {
    const { method } = req.query; // Get method from query params
    const paymentMethods = ['stripe', 'cash', 'pickup'];

    // If method is provided and valid, filter; otherwise, return all
    const query = method && paymentMethods.includes(method)
      ? { paymentMethod: method }
      : { paymentMethod: { $in: paymentMethods } };

    const orders = await Order.find(query).sort({ createdAt: -1 });;
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
});
// GET request to fetch pending data 
router.get('/api/orders/pending', async (req, res) => {
  try {
    const pendingOrders = await Order.find({ status: 'Pending' }).sort({ createdAt: -1 });
    res.status(200).json(pendingOrders);
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    res.status(500).json({ message: 'Failed to fetch pending orders', error });
  }
});
// GET request to fetch preparing data 
router.get('/api/orders/preparing', async (req, res) => {
  try {
    const preparingOrders = await Order.find({ status: 'Preparing' }).sort({ createdAt: -1 });;
    res.status(200).json(preparingOrders);
  } catch (error) {
    console.error('Error fetching preparing orders:', error);
    res.status(500).json({ message: 'Failed to fetch preparing orders', error });
  }
});



// GET request to fetch orders for a specific user (filtered by email)
router.get('/api/orders/user', async (req, res) => {
  const userEmail = req.query.email; // Get user email from query parameters

  if (!userEmail) {
    return res.status(400).json({ message: "User email is required" });
  }

  try {
    // Find orders that match the user's email and sort by creation date
    const userOrders = await Order.find({ userEmail }).sort({ createdAt: -1 });
    res.status(200).json(userOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Error retrieving user orders', error });
  }
});


router.patch('/api/orders/:id', async (req, res) => {
  const { time, status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'Preparing', $inc: { time: time } },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order time:', error);
    res.status(500).json({ error: 'Failed to update order time' });
  }
});

// In your Express server (example route to handle status update)

// PATCH request to update order status to 'Expired' if preparation time exceeds
router.patch('/api/orders/:id/expire', async (req, res) => {
  try {
    const orderId = req.params.id;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: 'Expired' },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order status updated to Expired',
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order status to expired:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});


// PATCH request to update order status
// PATCH request to update order status to 'Expired' if preparation time exceeds
router.patch('/api/orders/:id/expire', async (req, res) => {
  try {
    const orderId = req.params.id;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: 'Expired' },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order status updated to Expired',
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order status to expired:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});



// PATCH request to update order status
// PATCH request to update order status to 'Expired' if preparation time exceeds

// PATCH request to cancel an order
router.patch('/api/orders/:id/cancel', async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body; // Get new status from request body

  try {
    // Check if the order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure the order is only canceled before the 5-minute mark
    const now = new Date();
    const orderTime = new Date(order.updatedAt);
    const remainingTimeInMinutes = (now - orderTime) / 1000 / 60;

    if (remainingTimeInMinutes > 5) {
      return res.status(400).json({ message: 'Cannot cancel order after 5 minutes' });
    }

    // Update the order status to 'Canceled'
    order.status = status || 'Canceled';
    const updatedOrder = await order.save();

    res.status(200).json({
      message: 'Order status updated to Canceled',
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Error canceling order:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});
// GET request to fetch all orders for a specific user (filtered by email)
router.get('/api/orders/:email', async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: "User email is required" });
  }

  try {
    // Find orders that match the user's email and sort by creation date
    const userOrders = await Order.find({
      userEmail: email,
      status: { $in: ['Expired', 'Preparing'] } // Use $in to match either 'Expired' or 'Preparing'
    }).sort({ createdAt: -1 });
    res.status(200).json(userOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Error retrieving user orders', error });
  }
});



module.exports = router;