const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    availableBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AvailableBook',
      required: true
    },
    wantedBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WantedBook',
      required: true
    },
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
    sellerId: {
      type: String,
      required: true,
      trim: true
    },
    sellerName: {
      type: String,
      required: true,
      trim: true
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
    price: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      default: 'New'
    },
    notificationStatus: {
      type: String,
      enum: ['Unread', 'Read'],
      default: 'Unread'
    },
    matchDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Match', matchSchema);
