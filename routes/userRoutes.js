const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure the path is correct for your User model

// GET user details by ID
router.get('/api/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id); // Fetch user by ID
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user); // Respond with user details
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
