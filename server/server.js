const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const matchRoutes = require('./routes/matchRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'BookMatch API Server is running'
  });
});

// Register Match Routes
app.use('/api/matches', matchRoutes);

// Server listen function
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookmatch';

if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB successfully');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
    });
}

module.exports = app;
