require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');
const Book = require('./models/Book');
const AvailableBook = require('./models/AvailableBook');
const WantedBook = require('./models/WantedBook');

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookmatch';
    console.log(`Connecting to MongoDB at ${mongoURI}...`);
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB.');

    // Clear existing sample data to prevent duplicate keys
    console.log('Clearing existing data...');
    await Student.deleteMany({});
    await Book.deleteMany({});
    await AvailableBook.deleteMany({});
    await WantedBook.deleteMany({});
    console.log('Cleared existing collections.');

    // 1. Seed Books with verified aliases
    console.log('Seeding books...');
    const books = await Book.insertMany([
      {
        bookId: 'BOOK-1001',
        title: 'Thomas Calculus',
        author: 'George B. Thomas',
        aliases: [
          'Calculus Book',
          "Thomas' Calculus",
          'Thomas Calculus',
          'Thomas and Finney Calculus'
        ]
      },
      {
        bookId: 'BOOK-1002',
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        aliases: [
          'CLRS',
          'Algorithms Cormen',
          'Intro to Algorithms',
          'CLRS Algorithms'
        ]
      },
      {
        bookId: 'BOOK-1003',
        title: 'Database System Concepts',
        author: 'Abraham Silberschatz',
        aliases: [
          'Silberschatz Database',
          'Database Concepts',
          'Korth Database',
          'Silberschatz'
        ]
      },
      {
        bookId: 'BOOK-1004',
        title: 'Physics for Scientists and Engineers',
        author: 'Raymond A. Serway',
        aliases: [
          'Serway Physics',
          'Physics Serway',
          'Scientists and Engineers Physics'
        ]
      },
      {
        bookId: 'BOOK-1005',
        title: 'Campbell Biology',
        author: 'Lisa A. Urry',
        aliases: [
          "Campbell's Biology",
          'Biology Campbell',
          'General Biology Campbell'
        ]
      }
    ]);
    console.log(`Successfully seeded ${books.length} books.`);

    // 2. Seed Sample Students
    console.log('Seeding students...');
    const students = await Student.insertMany([
      {
        name: 'Alex Johnson',
        email: 'alex.j@university.edu',
        contact: '+1-555-0101'
      },
      {
        name: 'Samantha Reed',
        email: 'samantha.r@university.edu',
        contact: '+1-555-0102'
      },
      {
        name: 'Michael Chen',
        email: 'm.chen@university.edu',
        contact: '+1-555-0103'
      }
    ]);
    console.log(`Successfully seeded ${students.length} students.`);

    // 3. Seed Sample Available Book Listings
    console.log('Seeding available listings...');
    const availableBooks = await AvailableBook.insertMany([
      {
        studentId: students[0]._id, // Alex Johnson
        bookId: books[0].bookId,   // Thomas Calculus
        title: books[0].title,
        author: books[0].author,
        edition: '14th Edition',
        condition: 'Good',
        price: 45.00,
        status: 'Available'
      },
      {
        studentId: students[1]._id, // Samantha Reed
        bookId: books[1].bookId,   // CLRS
        title: books[1].title,
        author: books[1].author,
        edition: '4th Edition',
        condition: 'Like New',
        price: 65.00,
        status: 'Available'
      }
    ]);
    console.log(`Successfully seeded ${availableBooks.length} available listings.`);

    // 4. Seed Sample Wanted Book Listings
    console.log('Seeding wanted listings...');
    const wantedBooks = await WantedBook.insertMany([
      {
        studentId: students[1]._id, // Samantha Reed wants Thomas Calculus
        bookId: books[0].bookId,
        title: books[0].title,
        author: books[0].author,
        edition: '14th Edition',
        status: 'Active'
      },
      {
        studentId: students[2]._id, // Michael Chen wants CLRS
        bookId: books[1].bookId,
        title: books[1].title,
        author: books[1].author,
        edition: '4th Edition',
        status: 'Active'
      }
    ]);
    console.log(`Successfully seeded ${wantedBooks.length} wanted listings.`);

    console.log('\n=========================================');
    console.log(' Database Seeding Completed Successfully! ');
    console.log('=========================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedData();
