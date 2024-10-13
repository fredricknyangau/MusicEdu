const mongoose = require('mongoose');

const instrumentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    history: { type: String },
    imageURL: { type: String },
    soundSampleURL: { type: String }
});

const Instrument = mongoose.model('Instrument', instrumentSchema);
module.exports = Instrument;
