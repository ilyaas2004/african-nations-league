const express = require('express');
const router = express.Router();
const Winner = require('../models/Winner');

// Get all past winners
router.get('/', async (req, res) => {
  try {
    const winners = await Winner.find().sort({ year: -1 });
    res.json(winners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new winner (for admin)
router.post('/', async (req, res) => {
  try {
    const { teamName, year } = req.body;
    const winner = await Winner.create({ teamName, year });
    res.status(201).json(winner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
