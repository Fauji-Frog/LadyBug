const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Route imports
const matchRoutes = require('./routes/matchRoutes');
const listingRoutes = require('./routes/listingRoutes');
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check & Welcome Root Route with ReLeaf branding
app.get('/', (req, res) => {
  res.json({
    success: true,
    platform: 'ReLeaf – Student Book Exchange & Matching Platform',
    tagline: 'Give Books a New Chapter.',
    message: 'ReLeaf API Server is active and healthy',
    endpoints: {
      books: '/api/books',
      availableListings: '/api/listings/available',
      wantedListings: '/api/listings/wanted',
      matches: '/api/matches',
      runMatching: 'POST /api/matches/run',
      auth: '/api/auth'
    }
  });
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    platform: 'ReLeaf',
    message: 'ReLeaf Backend API is active and healthy',
    timestamp: new Date().toISOString()
  });
});

// Register API Routes
app.use('/api/matches', matchRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);

// Server listen function
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/releaf';

if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB successfully');
      app.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(`🌿 ReLeaf Backend Server running on port ${PORT}`);
        console.log(`   Tagline: "Give Books a New Chapter."`);
        console.log(`   Base URL: http://localhost:${PORT}`);
        console.log(`====================================================`);
      });
    })
    .catch((err) => {
      console.warn('MongoDB connection note (running in memory/offline mode if DB down):', err.message);
      app.listen(PORT, () => {
        console.log(`🌿 ReLeaf Express Server listening on port ${PORT}`);
      });
    });
}

module.exports = app;
