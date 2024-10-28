const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuSchema');

// Route to add menu items to the database
router.post('/', async (req, res) => {
  try {
    const { category, name, price } = req.body;
    const newMenuItem = new MenuItem({ category, name, price });
    await newMenuItem.save();
    res.status(201).json(newMenuItem);
  } catch (error) {
    res.status(400).json({ message: 'Error adding menu item', error });
  }
});

// Route to get all menu items
router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving menu items', error });
  }
});

module.exports = router;
