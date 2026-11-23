const mongoose = require('mongoose');

// WantedBook Schema definition
const wantedBookSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required']
    },
    bookId: {
      type: String,
      required: [true, 'Book ID is required'],
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true
    },
    edition: {
      type: String,
      required: [true, 'Book edition is required'],
      trim: true
    },
    status: {
      type: String,
      enum: {
        values: ['Active', 'Closed'],
        message: 'Status must be either Active or Closed'
      },
      default: 'Active'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const WantedBook = mongoose.model('WantedBook', wantedBookSchema);

module.exports = WantedBook;
