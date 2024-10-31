const express = require('express');
const router = express.Router();
const Category = require('../models/Category'); // Assuming you have a Category model defined

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find(); // Fetch all categories from the database
        res.json(categories); // Send categories as JSON response
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories' }); // Error handling
    }
});

// Add a new category (ADMIN ONLY)
router.post('/', async (req, res) => {
    try {
        const category = new Category(req.body); // Create a new category instance
        await category.save(); // Save the category to the database
        res.status(201).json(category); // Respond with the created category
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ message: 'Error adding category' }); // Error handling
    }
});

module.exports = router; // Export the router for use in the main app
