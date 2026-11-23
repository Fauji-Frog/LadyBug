const mongoose = require('mongoose');

const availableBookSchema = new mongoose.Schema(
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
    price: {
      type: Number,
      required: true
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
    status: {
      type: String,
      enum: ['Available', 'Sold', 'Unavailable'],
      default: 'Available'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AvailableBook', availableBookSchema);
