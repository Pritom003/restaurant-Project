const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuSchema');

router.post('/api/menu/:category/item', async (req, res) => {
  const { category } = req.params;
  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Items are required' });
  }

  try {
    // Check if the category already exists in the database
    const existingCategory = await MenuItem.findOne({ category });

    if (existingCategory) {
      // If the category exists, update it by pushing new items to the existing array
      existingCategory.items.push(...items);  // Spread operator to add new items to the array

      const updatedCategory = await existingCategory.save();  // Save the updated category

      return res.status(200).json({
        message: 'Item added successfully to existing category',
        data: updatedCategory,
      });
    } else {
      // If the category doesn't exist, create a new one
      const newMenuItem = new MenuItem({
        category,
        items,  // Add the items directly to the new category
      });

      const savedCategory = await newMenuItem.save();  // Save the new category to the database

      return res.status(201).json({
        message: 'New category created and item added successfully',
        data: savedCategory,
      });
    }
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Failed to add item' });
  }
});

router.get('/api/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving menu items', error });
  }
});

module.exports = router;
