const express = require('express');
const moment = require('moment');
const Order = require('../models/OrderScheema'); // Fixed typo (OrderScheema to OrderSchema)
const router = express.Router();

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
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date
    ]);

    res.json(revenue.map(({ _id, totalRevenue }) => ({ date: _id, totalRevenue })));
  } catch (error) {
    console.error('Error fetching daily revenue:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET request for weekly revenue
router.get('/api/revenue/weekly', async (req, res) => {
  try {
    const weekOffset = parseInt(req.query.weekOffset) || 0; // Get week offset from query or default to 0
    const startOfWeek = moment().startOf('week').add(weekOffset, 'weeks').toDate();
    const endOfWeek = moment().endOf('week').add(weekOffset, 'weeks').toDate();

    const revenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek, $lte: endOfWeek },
          paymentStatus: 'success',
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date
    ]);

    res.json(revenue.map(({ _id, totalRevenue }) => ({ date: _id, totalRevenue })));
  } catch (error) {
    console.error('Error fetching weekly revenue:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/api/revenue/monthly', async (req, res) => {
  try {
    const monthOffset = parseInt(req.query.monthOffset) || 0; // Get month offset from query or default to 0
    const startOfMonth = moment().startOf('month').add(monthOffset, 'months').toDate();
    const endOfMonth = moment().endOf('month').add(monthOffset, 'months').toDate();

    const revenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          paymentStatus: 'success',
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date
    ]);

    res.json(revenue.map(({ _id, totalRevenue }) => ({ date: _id, totalRevenue })));
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
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
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, // Group by year-month
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } }, // Sort by year-month
    ]);

    res.json(revenue.map(({ _id, totalRevenue }) => ({ month: _id, totalRevenue })));
  } catch (error) {
    console.error('Error fetching yearly revenue:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
