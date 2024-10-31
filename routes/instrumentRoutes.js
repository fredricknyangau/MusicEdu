const express = require('express');
const router = express.Router();
const Instrument = require('../models/Instrument');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Get all instruments
router.get('/', async (req, res) => {
    try {
        const instruments = await Instrument.find();
        res.json(instruments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching instruments' });
    }
});

// Add a new instrument (ADMIN ONLY)
router.post('/', upload.fields([{ name: 'image' }, { name: 'video' }]), async (req, res) => {
    try {
        const instrumentData = {
            name: req.body.name,
            origin_country: req.body.origin_country,
            description: req.body.description,
            historical_background: req.body.historical_background,
            categories: req.body.categories, // Array of category IDs
        };

        // Update URL paths
        if (req.files['image']) {
            instrumentData.image_url = `/uploads/${req.files['image'][0].filename}`; // Ensure correct path
        }
        if (req.files['video']) {
            instrumentData.video_url = `/uploads/${req.files['video'][0].filename}`; // Ensure correct path
        }

        const newInstrument = new Instrument(instrumentData);
        await newInstrument.save();
        res.status(201).json(newInstrument);
    } catch (error) {
        console.error('Error adding instrument:', error);
        res.status(500).json({ message: 'Error adding instrument' });
    }
});

module.exports = router;
