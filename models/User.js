const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'], // Adjust these values as needed
    required: true,
  },
  savedInstruments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Instrument' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
