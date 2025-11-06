// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'African Nations League API is running!' });
});

// Routes - Only add if files exist
try {
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');
} catch (err) {
  console.log('⚠️  Auth routes not found');
}

try {
  const teamRoutes = require('./routes/teams');
  app.use('/api/teams', teamRoutes);
  console.log('✅ Team routes loaded');
} catch (err) {
  console.log('⚠️  Team routes not found');
}

try {
  const matchRoutes = require('./routes/matches');
  app.use('/api/matches', matchRoutes);
  console.log('✅ Match routes loaded');
} catch (err) {
  console.log('⚠️  Match routes not found');
}

try {
  const winnerRoutes = require('./routes/winners'); // ✅ PLURAL FIX
  app.use('/api/winners', winnerRoutes);
  console.log('✅ Winner routes loaded');
} catch (err) {
  console.log('⚠️  Winner routes not found');
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
