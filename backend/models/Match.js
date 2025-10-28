const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  player: { type: String, required: true },
  minute: { type: Number, required: true },
  team: { type: String, required: true }
});

const matchSchema = new mongoose.Schema({
  round: { type: String, enum: ['quarter-final', 'semi-final', 'final'], required: true },
  team1: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  team2: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  team1Score: { type: Number, default: 0 },
  team2Score: { type: Number, default: 0 },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  goals: [goalSchema],
  commentary: { type: String }, // Full play-by-play for 'played' matches
  wasSimulated: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  playedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Match', matchSchema);