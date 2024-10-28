const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuSchema');

router.post('/', async (req, res) => {
  try {
    const { category, items } = req.body; // Updated to destructure items
    const newMenuItem = new MenuItem({ category, items }); // Use items array directly
    await newMenuItem.save();
    res.status(201).json(newMenuItem);
  } catch (error) {
    res.status(400).json({ message: 'Error adding menu item', error });
  }
});

router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving menu items', error });
  }
});

module.exports = router;
