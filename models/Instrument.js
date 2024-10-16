const mongoose = require('mongoose');

const InstrumentSchema = mongoose.Schema({
  name: { type: String, required: true },
  origin: { type: String, required: true },
  evolution: { type: String },
  culturalSignificance: { type: String },
  history: { type: String }
});

module.exports = mongoose.model('Instrument', InstrumentSchema);
