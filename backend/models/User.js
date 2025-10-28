const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'representative'], required: true },
  country: { type: String }, // Only for representatives
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);