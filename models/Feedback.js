const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    instrumentID: { type: mongoose.Schema.Types.ObjectId, ref: 'Instrument', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    timestamp: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
