const mongoose = require('mongoose');

// Valid condition values
const VALID_CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

// AvailableBook Schema definition
const availableBookSchema = new mongoose.Schema(
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
    condition: {
      type: String,
      required: [true, 'Book condition is required'],
      enum: {
        values: VALID_CONDITIONS,
        message: 'Condition must be one of: New, Like New, Good, Fair, Poor'
      }
    },
    price: {
      type: Number,
      required: [true, 'Price is required for available listings'],
      min: [0, 'Price must be a valid non-negative number']
    },
    status: {
      type: String,
      enum: {
        values: ['Available', 'Reserved', 'Sold'],
        message: 'Status must be Available, Reserved, or Sold'
      },
      default: 'Available'
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

const AvailableBook = mongoose.model('AvailableBook', availableBookSchema);

module.exports = AvailableBook;
