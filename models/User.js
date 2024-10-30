const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the user schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, minlength: 5 },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Store emails in lowercase for consistency
        match: /.+\@.+\..+/ // Basic regex for email validation
    },
    password: { type: String, required: true, minlength: 8 }, // Password must be at least 8 characters
    role: {
        type: String,
        enum: ['student', 'admin'],
        required: true,
    },
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
