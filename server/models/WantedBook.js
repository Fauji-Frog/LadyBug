const mongoose = require('mongoose');

const wantedBookSchema = new mongoose.Schema(
  {
    bookId: {
      type: String,
      required: true,
      trim: true
    },
    bookTitle: {
      type: String,
      required: true,
      trim: true
    },
    edition: {
      type: String,
      required: true,
      trim: true
    },
    maxPrice: {
      type: Number
    },
    buyerId: {
      type: String,
      required: true,
      trim: true
    },
    buyerName: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['Active', 'Fulfilled', 'Inactive'],
      default: 'Active'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('WantedBook', wantedBookSchema);
