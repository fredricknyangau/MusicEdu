const mongoose = require('mongoose'); 

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String }, // Optional field
    createdAt: { type: Date, default: Date.now }, // Optional timestamp
});

module.exports = mongoose.model('Category', CategorySchema);
