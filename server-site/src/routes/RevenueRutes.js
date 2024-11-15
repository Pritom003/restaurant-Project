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
router.get('/api/revenue/yearly', async (req, res) => {
  try {
    const startOfYear = moment().startOf('year').toDate();  // Start of the current year (January 1st)
    const endOfYear = moment().endOf('year').toDate();      // End of the current year (December 31st)

    // Aggregation to calculate the total revenue for the year
    const revenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear, $lte: endOfYear },  // Match orders within the current year
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
    console.error('Error fetching yearly revenue:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});
// Express route for dynamic date range revenue
router.get('/api/revenue/range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;  // Get start and end date from query parameters

    // Ensure the start and end dates are valid
    const start = moment(startDate).toDate();
    const end = moment(endDate).toDate();

    // Aggregation to calculate total revenue for the given date range
    const revenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },  // Match orders within the provided date range
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
    console.error('Error fetching revenue for date range:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = router;
