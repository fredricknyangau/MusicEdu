const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Get all categories
router.get('/', async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});

// Add a new category
router.post('/', async (req, res) => {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
});

module.exports = router;
