const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Adjust path if needed

router.get('/session-status', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Authenticated' });
});

module.exports = router;
