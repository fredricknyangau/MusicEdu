const express = require('express');
const { body, validationResult } = require('express-validator');
const Feedback = require('../models/Feedback');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();

// Create Feedback
router.post('/', authenticateJWT, [
  body('instrumentID').notEmpty().withMessage('Instrument ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').notEmpty().withMessage('Comment is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { instrumentID, rating, comment } = req.body;
  const userID = req.user.id;

  try {
    const newFeedback = new Feedback({ userID, instrumentID, rating, comment });
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Feedback by Instrument ID
router.get('/:instrumentId', async (req, res) => {
  const { instrumentId } = req.params;

  try {
    const feedback = await Feedback.find({ instrumentID: instrumentId }).populate('userID');
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
