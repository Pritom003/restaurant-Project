// routes/revenueRoutes.js
const express = require('express');
const moment = require('moment');
const Order = require('../models/OrderScheema'); // Mongoose model for Order
const router = express.Router();

// GET request for monthly revenue
router.get('/api/revenue/monthly', async (req, res) => {
  try {
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    const revenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          paymentStatus: 'success',
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
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
    const startOfWeek = moment().startOf('week').toDate();
    const endOfWeek = moment().endOf('week').toDate();

    const revenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek, $lte: endOfWeek },
          paymentStatus: 'success',
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);

    res.json({ revenue: revenue.length ? revenue[0].totalRevenue : 0 });
  } catch (error) {
    console.error('Error fetching weekly revenue:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET request for yearly revenue
router.get('/api/revenue/yearly', async (req, res) => {
  try {
    const startOfYear = moment().startOf('year').toDate();
    const endOfYear = moment().endOf('year').toDate();

    const revenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear, $lte: endOfYear },
          paymentStatus: 'success',
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);

    res.json({ revenue: revenue.length ? revenue[0].totalRevenue : 0 });
  } catch (error) {
    console.error('Error fetching yearly revenue:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET request for custom date range revenue
router.get('/api/revenue/range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = moment(startDate).toDate();
    const end = moment(endDate).toDate();

    const revenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: 'success',
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);

    res.json({ revenue: revenue.length ? revenue[0].totalRevenue : 0 });
  } catch (error) {
    console.error('Error fetching revenue for date range:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET request for daily revenue
router.get('/api/revenue/daily', async (req, res) => {
  try {
    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();

    const revenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          paymentStatus: 'success',
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);

    res.json({ revenue: revenue.length ? revenue[0].totalRevenue : 0 });
  } catch (error) {
    console.error('Error fetching daily revenue:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
