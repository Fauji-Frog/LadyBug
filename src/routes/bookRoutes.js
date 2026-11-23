const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Book = require('../models/Book');
const AvailableBook = require('../models/AvailableBook');
const WantedBook = require('../models/WantedBook');
const {
  normalizeTitle,
  escapeRegex,
  findBookByTitleOrAlias,
  generateBookId
} = require('../utils/bookHelper');

/**
 * @route   GET /api/books/search?q=calculus
 * @desc    Search books by title or alias (case-insensitive)
 * @access  Public
 * NOTE: Defined before /:id so Express doesn't treat 'search' as an ID parameter
 */
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Search query parameter "q" is required'
      });
    }

    const cleanQuery = escapeRegex(query.trim());
    const searchRegex = new RegExp(cleanQuery, 'i');

    // Search where title matches OR any alias matches
    const books = await Book.find({
      $or: [
        { title: { $regex: searchRegex } },
        { aliases: { $regex: searchRegex } }
      ]
    }).sort({ title: 1 });

    return res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to search books',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/books/resolve-title
 * @desc    Resolve a submitted title against existing titles and aliases.
 *          If found, returns the existing Book ID.
 *          If not found, notifies that a new book record can be created.
 * @access  Public
 */
router.post('/resolve-title', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Book title is required for resolution'
      });
    }

    const existingBook = await findBookByTitleOrAlias(title);

    if (existingBook) {
      return res.status(200).json({
        success: true,
        found: true,
        message: 'Matching book found in database',
        data: {
          bookId: existingBook.bookId,
          title: existingBook.title,
          author: existingBook.author,
          aliases: existingBook.aliases,
          id: existingBook._id
        }
      });
    }

    return res.status(200).json({
      success: true,
      found: false,
      message: 'No existing book found for this title or alias. A new book record can be created.',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to resolve book title',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/books
 * @desc    Create a new book record
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { title, author, aliases, bookId } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Book title is required'
      });
    }

    if (!author || !author.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Author is required'
      });
    }

    // Check if book with this title or alias already exists
    const existingBook = await findBookByTitleOrAlias(title);
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: `A book matching this title or alias already exists with Book ID: ${existingBook.bookId}`,
        data: {
          bookId: existingBook.bookId,
          title: existingBook.title,
          author: existingBook.author,
          aliases: existingBook.aliases
        }
      });
    }

    // Format aliases (clean strings, remove empty items and duplicates)
    let formattedAliases = [];
    if (Array.isArray(aliases)) {
      formattedAliases = aliases
        .map(a => (typeof a === 'string' ? a.trim() : ''))
        .filter(a => a.length > 0);
      formattedAliases = [...new Set(formattedAliases)];
    }

    // Determine unique Book ID
    const finalBookId = bookId && bookId.trim() ? bookId.trim().toUpperCase() : generateBookId();

    // Verify Book ID uniqueness
    const idTaken = await Book.findOne({ bookId: finalBookId });
    if (idTaken) {
      return res.status(400).json({
        success: false,
        message: `Book ID ${finalBookId} is already in use. Please provide a different one or leave it blank to auto-generate.`
      });
    }

    const newBook = new Book({
      bookId: finalBookId,
      title: title.trim(),
      author: author.trim(),
      aliases: formattedAliases
    });

    const savedBook = await newBook.save();

    return res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: savedBook
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create book',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/books
 * @desc    Get all books (with optional ?status=available or ?status=wanted query)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;

    if (status === 'available') {
      const availableListings = await AvailableBook.find({ status: 'Available' })
        .populate('studentId', 'name email contact')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: availableListings.length,
        data: availableListings
      });
    }

    if (status === 'wanted') {
      const wantedListings = await WantedBook.find({ status: 'Active' })
        .populate('studentId', 'name email contact')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: wantedListings.length,
        data: wantedListings
      });
    }

    const books = await Book.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch books',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/books/:id
 * @desc    Get a single book by MongoDB ID or Book ID (e.g. BK-1001)
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let book = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      book = await Book.findById(id);
    }

    if (!book) {
      book = await Book.findOne({ bookId: id.trim().toUpperCase() });
    }

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch book',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/books/:id
 * @desc    Update book details or add/remove aliases
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, aliases } = req.body;

    let book = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      book = await Book.findById(id);
    }
    if (!book) {
      book = await Book.findOne({ bookId: id.trim().toUpperCase() });
    }

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (title && title.trim()) {
      book.title = title.trim();
    }
    if (author && author.trim()) {
      book.author = author.trim();
    }
    if (Array.isArray(aliases)) {
      const cleanAliases = aliases
        .map(a => (typeof a === 'string' ? a.trim() : ''))
        .filter(a => a.length > 0);
      book.aliases = [...new Set(cleanAliases)];
    }

    const updatedBook = await book.save();

    return res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update book',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/books/:id
 * @desc    Delete a book
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let deletedBook = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deletedBook = await Book.findByIdAndDelete(id);
    }
    if (!deletedBook) {
      deletedBook = await Book.findOneAndDelete({ bookId: id.trim().toUpperCase() });
    }

    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: deletedBook
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete book',
      error: error.message
    });
  }
});

module.exports = router;
