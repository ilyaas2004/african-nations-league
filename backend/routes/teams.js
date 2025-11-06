// backend/routes/teams.js
const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Match = require('../models/Match');
const { auth, isAdmin } = require('../middleware/auth');


// Helper function to generate random player ratings
const generatePlayerRatings = (naturalPosition) => {
  const positions = ['GK', 'DF', 'MD', 'AT'];
  const ratings = {};
  
  positions.forEach(pos => {
    if (pos === naturalPosition) {
      // Natural position: 50-100
      ratings[pos] = Math.floor(Math.random() * 51) + 50;
    } else {
      // Other positions: 0-50
      ratings[pos] = Math.floor(Math.random() * 51);
    }
  });
  
  return ratings;
};

// Helper function to generate random player name
const generatePlayerName = () => {
  const firstNames = ['Mohamed', 'Sadio', 'Riyad', 'Percy', 'Victor', 'Achraf', 'Thomas', 'Wilfred', 
    'Kalidou', 'Edouard', 'Hakim', 'Naby', 'Nicolas', 'Andre', 'Bertrand', 'Eric', 'Youssef'];
  const lastNames = ['Salah', 'Mane', 'Mahrez', 'Tau', 'Osimhen', 'Hakimi', 'Partey', 'Zaha',
    'Koulibaly', 'Mendy', 'Ziyech', 'Keita', 'Pepe', 'Ayew', 'Traore', 'Bailly', 'En-Nesyri'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

// Get all teams
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find().populate('representative', 'email country');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single team
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('representative', 'email country');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create team (Representative only)
router.post('/', auth, async (req, res) => {
  try {
    const { country, manager, players } = req.body;

    // Check if user is a representative
    if (req.user.role !== 'representative') {
      return res.status(403).json({ message: 'Only representatives can create teams' });
    }

    // Check if team already exists
    const existingTeam = await Team.findOne({ country });
    if (existingTeam) {
      return res.status(400).json({ message: 'Team already exists for this country' });
    }

    // Generate players if not provided
    let teamPlayers = players;
    if (!players || players.length === 0) {
      teamPlayers = [];
      const positions = [
        { pos: 'GK', count: 3 },
        { pos: 'DF', count: 8 },
        { pos: 'MD', count: 7 },
        { pos: 'AT', count: 5 }
      ];

      let captainAssigned = false;
      positions.forEach(({ pos, count }) => {
        for (let i = 0; i < count; i++) {
          teamPlayers.push({
            name: generatePlayerName(),
            position: pos,
            ratings: generatePlayerRatings(pos),
            isCaptain: !captainAssigned && pos === 'DF' && i === 0 ? (captainAssigned = true) : false
          });
        }
      });
    } else {
      // Validate and generate ratings for provided players
      teamPlayers = players.map(player => ({
        ...player,
        ratings: generatePlayerRatings(player.position)
      }));
    }

    // Create team
    const team = new Team({
      country,
      manager,
      representative: req.user.userId,
      players: teamPlayers
    });

    await team.save();
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update team
router.put('/:id', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if user owns this team or is admin
    if (team.representative.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete team (Admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get top scorers
router.get('/stats/top-scorers', async (req, res) => {
  try {
    const teams = await Team.find();
    const allPlayers = [];
    
    teams.forEach(team => {
      team.players.forEach(player => {
        if (player.goalsScored > 0) {
          allPlayers.push({
            name: player.name,
            goals: player.goalsScored,
            country: team.country
          });
        }
      });
    });

    allPlayers.sort((a, b) => b.goals - a.goals);
    res.json(allPlayers.slice(0, 10)); // Top 10 scorers
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// 📊 Team Performance Analytics
router.get('/:id/analytics', async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [{ team1: req.params.id }, { team2: req.params.id }]
    });

    if (matches.length === 0) {
      return res.json({ message: 'No matches found for this team.' });
    }

    const totalPlayed = matches.length;
    const wins = matches.filter(m => m.winner && m.winner.toString() === req.params.id).length;
    const losses = matches.filter(m => m.status === 'completed' && m.winner && m.winner.toString() !== req.params.id).length;

    const goalsScored = matches.reduce((sum, match) => {
      const teamGoals = match.goals.filter(g => g.team === match.team1?.country || g.team === match.team2?.country)
        .filter(g => g.teamId === req.params.id).length;
      return sum + teamGoals;
    }, 0);

    res.json({ totalPlayed, wins, losses, goalsScored });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;