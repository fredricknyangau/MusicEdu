const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, enum: ['Login', 'Logout', 'Password Change'], required: true },
    timestamp: { type: Date, default: Date.now },
    ipAddress: { type: String }
});

const SecurityLog = mongoose.model('SecurityLog', logSchema);
module.exports = SecurityLog;
