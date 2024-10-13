const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    instrumentID: { type: mongoose.Schema.Types.ObjectId, ref: 'Instrument', required: true },
    interactionType: { type: String, enum: ['Viewed', 'Listened', 'Commented'], required: true },
    timestamp: { type: Date, default: Date.now }
});

const UserInteraction = mongoose.model('UserInteraction', interactionSchema);
module.exports = UserInteraction;
