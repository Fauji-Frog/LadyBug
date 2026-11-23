/**
 * Seed Database with Sample Data for Postman Testing
 * Run: node seed.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const AvailableBook = require('./models/AvailableBook');
const WantedBook = require('./models/WantedBook');
const Match = require('./models/Match');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookmatch';

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await AvailableBook.deleteMany({});
    await WantedBook.deleteMany({});
    await Match.deleteMany({});
    console.log('Cleared existing collections.');

    // 1. Available Books
    const availableBooks = await AvailableBook.insertMany([
      {
        bookId: 'BOOK101',
        bookTitle: 'Thomas Calculus',
        edition: '12th',
        price: 500,
        sellerId: 'STU01',
        sellerName: 'Student A',
        status: 'Available'
      },
      {
        bookId: 'BOOK102',
        bookTitle: 'Data Structures and Algorithms',
        edition: '3rd',
        price: 400,
        sellerId: 'STU03',
        sellerName: 'Student C',
        status: 'Available'
      },
      {
        bookId: 'BOOK104',
        bookTitle: 'Operating System Concepts',
        edition: '9th',
        price: 700,
        sellerId: 'STU07',
        sellerName: 'Student G',
        status: 'Available'
      },
      {
        bookId: 'BOOK105',
        bookTitle: 'Computer Networks',
        edition: '5th',
        price: 550,
        sellerId: 'STU09',
        sellerName: 'Student I',
        status: 'Sold' // Should NOT match (Rule 4)
      }
    ]);

    // 2. Wanted Books
    const wantedBooks = await WantedBook.insertMany([
      {
        bookId: 'BOOK101',
        bookTitle: 'Thomas Calculus',
        edition: '12th',
        maxPrice: 600,
        buyerId: 'STU02',
        buyerName: 'Student B',
        status: 'Active'
      },
      {
        bookId: 'BOOK102',
        bookTitle: 'Data Structures and Algorithms',
        edition: '4th', // Different edition, should NOT match (Rule 2)
        maxPrice: 450,
        buyerId: 'STU04',
        buyerName: 'Student D',
        status: 'Active'
      },
      {
        bookId: 'BOOK104',
        bookTitle: 'Operating System Concepts',
        edition: '9th',
        maxPrice: 350, // Different price, should STILL match (Rule 3)
        buyerId: 'STU08',
        buyerName: 'Student H',
        status: 'Active'
      }
    ]);

    console.log(`Seeded ${availableBooks.length} AvailableBooks and ${wantedBooks.length} WantedBooks successfully!`);
    console.log('You can now run POST http://localhost:5000/api/matches/run in Postman.');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
}

seedData();
