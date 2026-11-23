const mongoose = require('mongoose');

// Match Schema definition
// Used for integrating with the matching module developed by teammate
const matchSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Buyer Student ID is required']
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Seller Student ID is required']
    },
    availableBookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AvailableBook',
      required: [true, 'Available Book ID is required']
    },
    wantedBookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WantedBook',
      required: [true, 'Wanted Book ID is required']
    },
    bookId: {
      type: String,
      required: [true, 'Book ID is required'],
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
        values: ['Pending', 'Accepted', 'Completed', 'Cancelled'],
        message: 'Status must be Pending, Accepted, Completed, or Cancelled'
      },
      default: 'Pending'
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

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;
