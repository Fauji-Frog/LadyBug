const mongoose = require('mongoose');

const wantedBookSchema = new mongoose.Schema(
  {
    bookId: {
      type: String,
      required: true,
      trim: true
    },
    // Supports both bookTitle and title
    bookTitle: {
      type: String,
      trim: true
    },
    title: {
      type: String,
      trim: true
    },
    author: {
      type: String,
      trim: true,
      default: 'Unknown Author'
    },
    edition: {
      type: String,
      required: true,
      trim: true
    },
    maxPrice: {
      type: Number
    },
    // Supports both buyerId (String ID) and studentId (ObjectId/String)
    buyerId: {
      type: String,
      trim: true
    },
    buyerName: {
      type: String,
      trim: true
    },
    studentId: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'Student'
    },
    contact: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    department: {
      type: String,
      default: 'General Academic'
    },
    courseCode: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    },
    urgency: {
      type: String,
      enum: ['Urgent', 'Medium', 'Low'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Active', 'Fulfilled', 'Inactive', 'Closed'],
      default: 'Active'
    }
  },
  { timestamps: true }
);

// Pre-save hook to ensure title & bookTitle are synced
wantedBookSchema.pre('save', function (next) {
  if (this.title && !this.bookTitle) {
    this.bookTitle = this.title;
  } else if (this.bookTitle && !this.title) {
    this.title = this.bookTitle;
  }
  if (!this.buyerId && this.studentId) {
    this.buyerId = String(this.studentId);
  }
  next();
});

module.exports = mongoose.model('WantedBook', wantedBookSchema);
