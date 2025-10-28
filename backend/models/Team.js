const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, enum: ['GK', 'DF', 'MD', 'AT'], required: true },
  isCaptain: { type: Boolean, default: false },
  ratings: {
    GK: { type: Number, min: 0, max: 100 },
    DF: { type: Number, min: 0, max: 100 },
    MD: { type: Number, min: 0, max: 100 },
    AT: { type: Number, min: 0, max: 100 }
  },
  goalsScored: { type: Number, default: 0 }
});

const teamSchema = new mongoose.Schema({
  country: { type: String, required: true, unique: true },
  manager: { type: String, required: true },
  representative: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  players: [playerSchema],
  teamRating: { type: Number },
  isEliminated: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Calculate team rating before saving
teamSchema.pre('save', function(next) {
  if (this.players.length > 0) {
    const totalRating = this.players.reduce((sum, player) => {
      const playerAvg = (player.ratings.GK + player.ratings.DF + player.ratings.MD + player.ratings.AT) / 4;
      return sum + playerAvg;
    }, 0);
    this.teamRating = totalRating / this.players.length;
  }
  next();
});

module.exports = mongoose.model('Team', teamSchema);
