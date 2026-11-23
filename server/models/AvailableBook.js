const mongoose = require('mongoose');

const availableBookSchema = new mongoose.Schema(
  {
    bookId: {
      type: String,
      required: true,
      trim: true
    },
    // Supports both bookTitle (Farin) and title (Nipun & Frontend)
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
    condition: {
      type: String,
      enum: ['New', 'Like New', 'Good', 'Fair', 'Poor', 'Used'],
      default: 'Good'
    },
    price: {
      type: Number,
      required: true
    },
    // Supports both sellerId (String ID) and studentId (ObjectId or String)
    sellerId: {
      type: String,
      trim: true
    },
    sellerName: {
      type: String,
      trim: true
    },
    studentId: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'Student'
    },
    sellerContact: {
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
    pickupLocation: {
      type: String,
      default: 'Main Campus Library'
    },
    description: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Available', 'Sold', 'Unavailable'],
      default: 'Available'
    }
  },
  { timestamps: true }
);

// Pre-save hook to ensure title & bookTitle, and sellerName & student details are synced
availableBookSchema.pre('save', function (next) {
  if (this.title && !this.bookTitle) {
    this.bookTitle = this.title;
  } else if (this.bookTitle && !this.title) {
    this.title = this.bookTitle;
  }
  if (!this.sellerId && this.studentId) {
    this.sellerId = String(this.studentId);
  }
  next();
});

module.exports = mongoose.model('AvailableBook', availableBookSchema);
