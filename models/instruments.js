const mongoose = require('mongoose');

const InstrumentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    origin_country: { type: String, required: true },
    description: { type: String, required: true },
    image_url: { type: String, required: true },
    video_url: { type: String, required: true },
    historical_background: { type: String, required: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
});

module.exports = mongoose.model('instrument', InstrumentSchema);
