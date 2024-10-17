const express = require('express');
const Instrument = require('../models/Instrument');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();

// Create a new instrument
router.post('/', authenticateJWT, async (req, res) => {
  const { name } = req.body;

  try {
    const newInstrument = new Instrument({ name });
    await newInstrument.save();
    res.status(201).json(newInstrument);
  } catch (error) {
    console.error('Error creating instrument:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all instruments
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const instruments = await Instrument.find();
    res.status(200).json(instruments);
  } catch (error) {
    console.error('Error fetching instruments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an instrument
router.delete('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    await Instrument.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting instrument:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
