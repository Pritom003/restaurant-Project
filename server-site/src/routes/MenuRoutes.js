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
// Update Menu Item in Backend
// Backend: PUT route to update menu item
router.put('/menu/item', async (req, res) => {
  const { category, name, updatedName, updatedPrice } = req.body;

  try {
    const menu = await MenuItem.findOne({ category, 'items.name': name });

    if (!menu) {
      return res.status(404).json({ message: 'Menu or item not found.' });
    }

    const item = menu.items.find(item => item.name === name);
    if (item) {
      item.name = updatedName || item.name;
      item.price = updatedPrice || item.price;
      await menu.save(); // Save the updated menu document
      res.status(200).json({ message: 'Menu item updated successfully.' });
    } else {
      res.status(404).json({ message: 'Item not found.' });
    }
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Error updating item.', error });
  }
});

// Delete menu item
router.delete('/menu/item', async (req, res) => {
  const { category, itemName } = req.body;

  try {
    const menu = await MenuItem.findOne({ category });

    if (!menu) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Remove the item by filtering out the item
    const initialItemCount = menu.items.length;
    menu.items = menu.items.filter(item => item.name !== itemName);

    if (menu.items.length === initialItemCount) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const updatedMenu = await menu.save(); // Save the updated menu
    res.status(200).json({ message: 'Menu item deleted successfully', data: updatedMenu });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Update category name
router.put('/menu/category', async (req, res) => {
  const { oldCategory, newCategory } = req.body;

  try {
    const menu = await MenuItem.findOne({ category: oldCategory });

    if (!menu) {
      return res.status(404).json({ message: 'Category not found' });
    }

    menu.category = newCategory;
    await menu.save(); // Save updated category name
    res.status(200).json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Error updating category.' });
  }
});




module.exports = router;
