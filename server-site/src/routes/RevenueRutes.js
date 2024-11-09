const express = require('express');
const moment = require('moment');
const Order = require('../models/OrderScheema'); // Your Mongoose model for Order
const router = express.Router();

// GET request for monthly revenue
router.get('/api/revenue/monthly', async (req, res) => {
  try {
    const startOfMonth = moment().startOf('month').toDate();  // Start of the current month
    const endOfMonth = moment().endOf('month').toDate();      // End of the current month

    // Aggregation to calculate the total revenue for the month
    const revenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },  // Match orders within the current month
          paymentStatus: 'success',  // Filter for paid orders (or 'success' if that's your payment status)
        },
      },
      {
        $group: {
          _id: null,  // No grouping needed, just sum everything
          totalRevenue: { $sum: '$totalPrice' },  // Sum the totalPrice for all matched orders
        },
      },
    ]);

    res.json({ revenue: revenue.length ? revenue[0].totalRevenue : 0 });
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET request for weekly revenue
router.get('/api/revenue/weekly', async (req, res) => {
  try {
    const startOfWeek = moment().startOf('week').toDate();  // Start of the current week (Sunday)
    const endOfWeek = moment().endOf('week').toDate();      // End of the current week (Saturday)

    // Aggregation to calculate the total revenue for the week
    const revenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek, $lte: endOfWeek },  // Match orders within the current week
          paymentStatus: 'success',  // Filter for paid orders
        },
      },
      {
        $group: {
          _id: null,  // No grouping needed, just sum everything
          totalRevenue: { $sum: '$totalPrice' },  // Sum the totalPrice for all matched orders
        },
      },
    ]);

    res.json({ revenue: revenue.length ? revenue[0].totalRevenue : 0 });
  } catch (error) {
    console.error('Error fetching weekly revenue:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
