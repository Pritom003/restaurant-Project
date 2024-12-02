const express = require('express');
const router = express.Router();
const SpecialMenu = require('../models/SpecialMenu'); // Adjust the path as needed

// POST /api/special-menu
router.post('/api/special-menu', async (req, res) => {
    try {
        // Directly use the request body data
        console.log(req.body);
        console.log(req.body.dishes);
        const newSpecialMenu = new SpecialMenu(req.body);

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
