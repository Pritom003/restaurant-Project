const express = require('express');
const router = express.Router();
const SpecialMenu = require('../models/SpecialMenu'); // Adjust the path as needed

// POST /api/special-menu
router.post('/api/special-menu', async (req, res) => {
    const { category, subcategories, price } = req.body;

    // Validate required fields
    if (!category || !price) {
        return res.status(400).json({ message: 'Category and price are required.' });
    }

    if (!subcategories || subcategories.length === 0) {
        return res.status(400).json({ message: 'Subcategories are required.' });
    }

    // Validate subcategories structure (ensure they have a name and items)
    const validSubcategories = subcategories.map(subcategory => {
        if (!subcategory.name || subcategory.dishes.length === 0) {
            return null; // If invalid, return null to filter it out
        }
        return {
            name: subcategory.name,
            dishes: subcategory.dishes.filter(dish => dish.name), // Ensure dishes have names
        };
    }).filter(subcategory => subcategory !== null); // Remove invalid subcategories

    if (validSubcategories.length === 0) {
        return res.status(400).json({ message: 'Each subcategory must have a name and at least one dish.' });
    }

    try {
        // Create a new special menu instance
        const newSpecialMenu = new SpecialMenu({
            category,
            price, // Save the price to the database
            subcategories: validSubcategories,
        });

        // Save to the database
        await newSpecialMenu.save();

        // Return the saved menu data
        res.status(201).json({ message: 'Special menu added successfully!', data: newSpecialMenu });
    } catch (error) {
        console.error('Error saving special menu:', error);
        res.status(500).json({ message: 'Failed to add menu. Please try again.' });
    }
});

// GET /api/special-menu
router.get('/api/special-menu', async (req, res) => {
    try {
        const menus = await SpecialMenu.find(); // Fetches all menu categories with items
        res.status(200).json(menus);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch menu', error });
    }
});

module.exports = router;
