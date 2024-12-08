const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuSchema');

router.post('/api/menu/:category/item', async (req, res) => {
  const { category } = req.params;
  const { items } = req.body;
  console.log('From BackEnd', items)
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Items are required' });
  }

  try {
    let menu = await MenuItem.findOne({ category });

    if (menu) {
      menu.items.push(...items);
      await menu.save();
      res.status(200).json({ message: 'Item added to existing category', data: menu });
    } else {
      menu = new MenuItem({ category, items });
      await menu.save();
      res.status(201).json({ message: 'New category created', data: menu });
    }
  } catch (error) {
    console.error(error);
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

// DELETE route to delete menu item
router.delete('/api/menu/:category/item/:name', async (req, res) => {
  const { category, name } = req.params;

  try {
    const menu = await MenuItem.findOne({ category });

    if (!menu) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    const itemIndex = menu.items.findIndex(item => item.name === name);
    if (itemIndex !== -1) {
      menu.items.splice(itemIndex, 1); // Remove item from the array
      await menu.save(); // Save the updated menu document
      res.status(200).json({ message: 'Item deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Item not found.' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Error deleting item.', error });
  }
});


// PUT route to update menu item


// Update item in the menu
router.put('/api/menu/:category/:itemName', async (req, res) => {
  const { category, itemName } = req.params;
  const { name, price } = req.body;

  try {
    // Find the category and update the item
    const menu = await MenuItem.findOne({ category });

    if (!menu) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const itemIndex = menu.items.findIndex((item) => item.name === itemName);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Update the item
    menu.items[itemIndex] = { name, price };
    await menu.save();

    res.status(200).json(menu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating item' });
  }
});





// Update a specific variety's price
router.put('/api/menu/:category/:itemName/variety/:varietyName', async (req, res) => {
  const { category, itemName, varietyName } = req.params;
  const { price } = req.body;

  try {
    // Find the category
    const menu = await MenuItem.findOne({ category });

    if (!menu) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find the item within the category
    const item = menu.items.find((item) => item.name === itemName);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Find the variety within the item
    const variety = item.varieties.find((v) => v.name === varietyName);

    if (!variety) {
      return res.status(404).json({ message: 'Variety not found' });
    }

    // Update the variety price
    variety.price = price;
    await menu.save();

    res.status(200).json({ message: 'Variety updated successfully', menu });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating variety' });
  }
});





module.exports = router;



