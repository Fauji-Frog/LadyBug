const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const AvailableBook = require('../models/AvailableBook');
const WantedBook = require('../models/WantedBook');
const { normalizeTitle, escapeRegex, generateBookId } = require('../utils/bookHelper');

/**
 * @route   GET /api/books
 * @desc    Fetch books catalog OR query by status (available / wanted)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;

    if (status === 'available') {
      const available = await AvailableBook.find({ status: 'Available' }).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: available.length,
        data: available
      });
    }

    if (status === 'wanted') {
      const wanted = await WantedBook.find({ status: 'Active' }).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: wanted.length,
        data: wanted
      });
    }

    // Default: Return all books in catalog
    const books = await Book.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve books',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/books/search?q=calculus
 * @desc    Search books by title, author, or alias
 * @access  Public
 */
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Search query parameter (q) is required'
      });
    }

    const cleanQuery = escapeRegex(normalizeTitle(q));
    const searchRegex = new RegExp(cleanQuery, 'i');

    const matchingBooks = await Book.find({
      $or: [
        { title: { $regex: searchRegex } },
        { author: { $regex: searchRegex } },
        { aliases: { $regex: searchRegex } },
        { bookId: { $regex: new RegExp(`^${cleanQuery}$`, 'i') } }
      ]
    });

    return res.status(200).json({
      success: true,
      count: matchingBooks.length,
      query: q,
      data: matchingBooks
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Search operation failed',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/books
 * @desc    Register a new book in the catalog
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { title, author, aliases, bookId } = req.body;

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

    const finalBookId = (bookId ? bookId.trim().toUpperCase() : generateBookId());

    const existing = await Book.findOne({ bookId: finalBookId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Book with ID ${finalBookId} already exists`
      });
    }

    const book = new Book({
      bookId: finalBookId,
      title: title.trim(),
      author: author.trim(),
      aliases: Array.isArray(aliases) ? aliases.map(a => a.trim()) : []
    });

    const savedBook = await book.save();

    return res.status(201).json({
      success: true,
      message: 'Book added to catalog successfully',
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

module.exports = router;
