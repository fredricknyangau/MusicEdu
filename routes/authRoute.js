const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
    const { name, username, email, password, role } = req.body;

    if (!name || !username || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, username, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Login successful', token, role: user.role });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
    const userId = req.user.id; 
    try {
        const user = await User.findById(userId).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user profile', error: error.message });
    }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
    const userId = req.user.id; 
    const { name, username, email } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, username, email },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
});

module.exports = router;
