const express = require('express');
const UserInteraction = require('../models/UserInteraction');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();

// Create a user interaction
router.post('/', authenticateJWT, async (req, res) => {
  const { instrumentID, interactionType } = req.body;
  const userID = req.user.id;

  try {
    const newInteraction = new UserInteraction({ userID, instrumentID, interactionType });
    await newInteraction.save();
    res.status(201).json(newInteraction);
  } catch (error) {
    console.error('Error creating interaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get interactions by user
router.get('/:userId', authenticateJWT, async (req, res) => {
  const { userId } = req.params;

  try {
    const interactions = await UserInteraction.find({ userID: userId }).populate('instrumentID');
    res.status(200).json(interactions);
  } catch (error) {
    console.error('Error fetching interactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
