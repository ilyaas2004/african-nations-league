// backend/routes/matches.js
const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const Team = require('../models/Team');
const Winner = require('../models/Winner');
const { auth, isAdmin } = require('../middleware/auth');

// Get all matches
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('team1', 'country manager')
      .populate('team2', 'country manager')
      .populate('winner', 'country')
      .sort({ createdAt: 1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single match
router.get('/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('team1')
      .populate('team2')
      .populate('winner', 'country');
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Generate tournament bracket (Admin only)
router.post('/generate-bracket', auth, isAdmin, async (req, res) => {
  try {
    const teams = await Team.find({ isEliminated: false });
    if (teams.length !== 8) {
      return res.status(400).json({ 
        message: `Need exactly 8 teams. Currently have ${teams.length} teams.` 
      });
    }

    await Match.deleteMany({});
    const shuffledTeams = teams.sort(() => Math.random() - 0.5);
    const quarterFinals = [];

    for (let i = 0; i < 8; i += 2) {
      const match = new Match({
        round: 'quarter-final',
        team1: shuffledTeams[i]._id,
        team2: shuffledTeams[i + 1]._id
      });
      await match.save();
      quarterFinals.push(match);
    }

    res.status(201).json({ message: 'Tournament bracket generated', quarterFinals });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Simulate a match (Admin only)
router.post('/:id/simulate', auth, isAdmin, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('team1')
      .populate('team2');

    if (!match) return res.status(404).json({ message: 'Match not found' });
    if (match.status === 'completed') return res.status(400).json({ message: 'Match already completed' });

    // Simple simulation based on team ratings
    const team1Goals = Math.floor(Math.random() * 4);
    const team2Goals = Math.floor(Math.random() * 4);

    // Generate goal scorers
    const goals = [];
    for (let i = 0; i < team1Goals; i++) {
      const scorer = match.team1.players[Math.floor(Math.random() * match.team1.players.length)];
      goals.push({ player: scorer.name, minute: Math.floor(Math.random() * 90) + 1, team: match.team1.country });
      scorer.goalsScored += 1;
    }
    for (let i = 0; i < team2Goals; i++) {
      const scorer = match.team2.players[Math.floor(Math.random() * match.team2.players.length)];
      goals.push({ player: scorer.name, minute: Math.floor(Math.random() * 90) + 1, team: match.team2.country });
      scorer.goalsScored += 1;
    }
    goals.sort((a, b) => a.minute - b.minute);

    // Determine winner
    let winner;
    if (team1Goals > team2Goals) {
      winner = match.team1._id;
      match.team2.isEliminated = true;
    } else if (team2Goals > team1Goals) {
      winner = match.team2._id;
      match.team1.isEliminated = true;
    } else {
      winner = Math.random() > 0.5 ? match.team1._id : match.team2._id;
      if (winner.toString() === match.team1._id.toString()) match.team2.isEliminated = true;
      else match.team1.isEliminated = true;
    }

    // Update match
    match.team1Score = team1Goals;
    match.team2Score = team2Goals;
    match.winner = winner;
    match.goals = goals;
    match.wasSimulated = true;
    match.status = 'completed';
    match.playedAt = new Date();

    await match.save();
    await match.team1.save();
    await match.team2.save();

    // ✅ Save tournament winner if this was the final
    if (match.round === 'final' && match.status === 'completed') {
      const winningTeam = await Team.findById(match.winner);
      if (winningTeam) {
        await Winner.create({
          teamName: winningTeam.country,
          year: new Date().getFullYear(),
        });
        console.log(`🏆 ${winningTeam.country} saved as ${new Date().getFullYear()} winner`);
      }
    }

    // Create next round match if applicable
    await createNextRoundMatch(match);

    res.json(match);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function to create next round matches
async function createNextRoundMatch(completedMatch) {
  if (completedMatch.round === 'final') return; // Tournament complete

  const nextRound = completedMatch.round === 'quarter-final' ? 'semi-final' : 'final';
  const allMatches = await Match.find({ round: completedMatch.round, status: 'completed' }).sort({ createdAt: 1 });
  const currentIndex = allMatches.findIndex(m => m._id.toString() === completedMatch._id.toString());
  const pairIndex = currentIndex % 2 === 0 ? currentIndex + 1 : currentIndex - 1;

  if (allMatches[pairIndex]) {
    const winner1 = currentIndex % 2 === 0 ? completedMatch.winner : allMatches[pairIndex].winner;
    const winner2 = currentIndex % 2 === 0 ? allMatches[pairIndex].winner : completedMatch.winner;
    const nextMatch = new Match({ round: nextRound, team1: winner1, team2: winner2 });
    await nextMatch.save();
  }
}

// Reset tournament (Admin only)
router.post('/reset', auth, isAdmin, async (req, res) => {
  try {
    await Match.deleteMany({});
    await Team.updateMany({}, { isEliminated: false, 'players.$[].goalsScored': 0 });
    res.json({ message: 'Tournament reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
