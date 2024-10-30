const express = require('express');
const router = express.Router();
const Instrument = require('../models/instruments'); 
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Directory for storing uploaded files
    },
    filename: (req, file, cb) => {
        // Prevent file name conflicts by adding a timestamp
        cb(null, Date.now() + '-' + file.originalname); 
    }
});

// Configure multer
const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limit files to 5 MB
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|mp4|mov|avi/; // Allowed file types
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb('Error: File type not supported!');
    }
});

// POST route to add an instrument
router.post('/', upload.fields([{ name: 'image' }, { name: 'video' }]), async (req, res) => {
    try {
        const instrumentData = {
            name: req.body.name,
            origin_country: req.body.origin_country,
            description: req.body.description,
            historical_background: req.body.historical_background,
            categories: req.body.categories // Assume these are category IDs
        };

        // Check if files are provided
        if (req.files['image']) {
            instrumentData.image_url = req.files['image'][0].path; // Path to the uploaded image
        }
        if (req.files['video']) {
            instrumentData.video_url = req.files['video'][0].path; // Path to the uploaded video
        }

        const newInstrument = new Instrument(instrumentData);
        await newInstrument.save();
        res.status(201).send('Instrument added successfully');
    } catch (error) {
        console.error('Error adding instrument:', error);
        res.status(500).send('Error adding instrument');
    }
});

// Export the router
module.exports = router;
