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

// PUT /api/special-menu/:category
// PUT /api/special-menu
router.put('/api/special-menu/:category', async (req, res) => {
    try {
        // Extract category name from the URL parameter
        const categoryName = req.params.category;

        // Check if the category already exists in the database
        const existingCategory = await SpecialMenu.findOne({ category: categoryName });

        if (existingCategory) {
            // Update the existing category with new data
            existingCategory.Price = req.body.Price;

            // Loop through subcategories to update or add new subcategories
            req.body.subcategories.forEach((newSubcategory) => {
                const existingSubcategoryIndex = existingCategory.subcategories.findIndex(
                    (sub) => sub.name === newSubcategory.name
                );

                if (existingSubcategoryIndex !== -1) {
                    // Update existing subcategory
                    existingCategory.subcategories[existingSubcategoryIndex].price = newSubcategory.price;

                    // Add new dishes to the existing subcategory
                    newSubcategory.dishes.forEach((newDish) => {
                        const existingDishIndex = existingCategory.subcategories[existingSubcategoryIndex].dishes.findIndex(
                            (dish) => dish.name === newDish.name
                        );

                        if (existingDishIndex === -1) {
                            // Add new dish if it doesn't exist in the subcategory
                            existingCategory.subcategories[existingSubcategoryIndex].dishes.push(newDish);
                        }
                    });
                } else {
                    // If subcategory doesn't exist, add it
                    existingCategory.subcategories.push(newSubcategory);
                }
            });

            // Save the updated category
            await existingCategory.save();

            // Return the updated category data
            res.status(200).json({ message: 'Special menu updated successfully!', data: existingCategory });
        } else {
            // If category doesn't exist, create a new one
            const newSpecialMenu = new SpecialMenu(req.body);
            await newSpecialMenu.save();
            res.status(201).json({ message: 'Special menu added successfully!', data: newSpecialMenu });
        }
    } catch (error) {
        console.error('Error updating special menu:', error);
        res.status(500).json({ message: 'Failed to update menu. Please try again.' });
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
// DELETE /api/special-menu/:category
router.delete('/api/special-menu/:category', async (req, res) => {
    try {
        const categoryName = req.params.category;
        const result = await SpecialMenu.findOneAndDelete({ category: categoryName });
        if (result) {
            res.status(200).json({ message: 'Category deleted successfully' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete category', error });
    }
});

// DELETE /api/special-menu/:category/subcategory/:subcategory
router.delete('/api/special-menu/:category/subcategory/:subcategory', async (req, res) => {
    try {
        const { category, subcategory } = req.params;
        const menu = await SpecialMenu.findOne({ category });

        if (menu) {
            const subcategoryIndex = menu.subcategories.findIndex(sub => sub.name === subcategory);
            if (subcategoryIndex !== -1) {
                menu.subcategories.splice(subcategoryIndex, 1);
                await menu.save();
                res.status(200).json({ message: 'Subcategory deleted successfully' });
            } else {
                res.status(404).json({ message: 'Subcategory not found' });
            }
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete subcategory', error });
    }
});

// DELETE /api/special-menu/:category/subcategory/:subcategory/dish/:dish
router.delete('/api/special-menu/:category/subcategory/:subcategory/dish/:dish', async (req, res) => {
    try {
        const { category, subcategory, dish } = req.params;
        const menu = await SpecialMenu.findOne({ category });

        if (menu) {
            const subcategory = menu.subcategories.find(sub => sub.name === subcategory);
            if (subcategory) {
                const dishIndex = subcategory.dishes.findIndex(d => d.name === dish);
                if (dishIndex !== -1) {
                    subcategory.dishes.splice(dishIndex, 1);
                    await menu.save();
                    res.status(200).json({ message: 'Dish deleted successfully' });
                } else {
                    res.status(404).json({ message: 'Dish not found' });
                }
            } else {
                res.status(404).json({ message: 'Subcategory not found' });
            }
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete dish', error });
    }
});

module.exports = router;
