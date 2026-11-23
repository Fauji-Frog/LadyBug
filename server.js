// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Import route modules
const studentRoutes = require('./src/routes/studentRoutes');
const bookRoutes = require('./src/routes/bookRoutes');
const listingRoutes = require('./src/routes/listingRoutes');
const matchRoutes = require('./src/routes/matchRoutes');
const authRoutes = require('./src/routes/authRoutes');

// Initialize Express application
const app = express();

// Standard middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Root route - Welcome and API index
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the BookMatch API - University Textbook Exchange Platform',
    endpoints: {
      students: '/api/students',
      books: '/api/books',
      search: '/api/books/search?q=calculus',
      availableListings: '/api/listings/available',
      wantedListings: '/api/listings/wanted',
      matches: '/api/matches',
      auth: '/api/auth'
    }
  });
});

// Root API health check
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'BookMatch Backend API is active and healthy',
    timestamp: new Date().toISOString()
  });
});

// Mount API routes
app.use('/api/students', studentRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/auth', authRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start listening for incoming requests
const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` BookMatch Server running on port ${PORT}`);
  console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Base URL: http://localhost:${PORT}`);
  console.log(`===============================================`);
});

module.exports = { app, server };
