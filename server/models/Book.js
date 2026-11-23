const mongoose = require('mongoose');

// Book Catalog Schema definition
const bookSchema = new mongoose.Schema(
  {
    bookId: {
      type: String,
      required: [true, 'Book ID is required'],
      unique: true,
      trim: true,
      uppercase: true
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
    aliases: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Text index to optimize searching by title or aliases
bookSchema.index({ title: 'text', aliases: 'text' });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
