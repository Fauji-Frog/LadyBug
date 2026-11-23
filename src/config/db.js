const mongoose = require('mongoose');

/**
 * Connect to MongoDB Database
 * Reads MONGODB_URI from environment variables or falls back to local database.
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookmatch';
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 4000 // Fast timeout so server doesn't hang indefinitely if DB is offline
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Warning: ${error.message}`);
    console.error('Note: If running locally without a local MongoDB service, provide your MongoDB Atlas URI in .env:');
    console.error('      MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bookmatch');
  }
};

module.exports = connectDB;
