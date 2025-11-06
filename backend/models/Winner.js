const mongoose = require('mongoose');

const WinnerSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  year: { type: Number, required: true },
  dateRecorded: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Winner', WinnerSchema);
