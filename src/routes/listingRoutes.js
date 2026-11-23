const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const AvailableBook = require('../models/AvailableBook');
const WantedBook = require('../models/WantedBook');
const Student = require('../models/Student');
const Book = require('../models/Book');
const {
  findBookByTitleOrAlias,
  generateBookId
} = require('../utils/bookHelper');

const VALID_CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

/**
 * Helper to resolve or auto-create a student from listing payloads.
 * Supports direct API calls with studentId as well as frontend submissions with studentName/contact.
 */
async function resolveStudent(body) {
  const { studentId, studentName, name, sellerContact, contact, phone, email } = body;

  if (studentId) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw new Error('Invalid Student ID format');
    }
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error('Student not found with the provided ID');
    }
    return student._id;
  }

  // Fallback for frontend forms sending studentName & contact
  const chosenName = (studentName || name || '').trim();
  const chosenContact = (sellerContact || contact || phone || '').trim();

  if (!chosenName) {
    throw new Error('Student ID or Student Name is required');
  }

  // Look for existing student by contact or email
  let student = null;
  if (chosenContact) {
    student = await Student.findOne({ contact: chosenContact });
  }

  if (!student) {
    const generatedEmail = email && email.trim()
      ? email.trim().toLowerCase()
      : `student.${Date.now()}.${Math.floor(Math.random() * 1000)}@university.edu`;

    student = new Student({
      name: chosenName,
      email: generatedEmail,
      contact: chosenContact || 'N/A'
    });
    await student.save();
  }

  return student._id;
}

// ==========================================
// AVAILABLE BOOK LISTING ROUTES
// ==========================================

/**
 * @route   POST /api/listings/available
 * @desc    Create a new available textbook listing
 * @access  Public
 */
router.post('/available', async (req, res) => {
  try {
    const { title, author, edition, condition, price, bookId } = req.body;

    // 1. Resolve Student ID
    let resolvedStudentId;
    try {
      resolvedStudentId = await resolveStudent(req.body);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    // 2. Validate required fields
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

    if (!edition || !edition.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Edition is required'
      });
    }

    if (!condition || !VALID_CONDITIONS.includes(condition)) {
      return res.status(400).json({
        success: false,
        message: `Book condition is required and must be one of: ${VALID_CONDITIONS.join(', ')}`
      });
    }

    if (price === undefined || price === null || price === '') {
      return res.status(400).json({
        success: false,
        message: 'Price is required for available listings'
      });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid non-negative number'
      });
    }

    // 3. Resolve Book ID via title/alias or create a new Book if not found
    let finalBookId = bookId ? bookId.trim().toUpperCase() : null;

    if (!finalBookId) {
      const existingBook = await findBookByTitleOrAlias(title);
      if (existingBook) {
        finalBookId = existingBook.bookId;
      } else {
        finalBookId = generateBookId();
        const newBookRecord = new Book({
          bookId: finalBookId,
          title: title.trim(),
          author: author.trim(),
          aliases: []
        });
        await newBookRecord.save();
      }
    } else {
      const existingBook = await Book.findOne({ bookId: finalBookId });
      if (!existingBook) {
        const newBookRecord = new Book({
          bookId: finalBookId,
          title: title.trim(),
          author: author.trim(),
          aliases: []
        });
        await newBookRecord.save();
      }
    }

    // 4. Create the AvailableBook listing
    const listing = new AvailableBook({
      studentId: resolvedStudentId,
      bookId: finalBookId,
      title: title.trim(),
      author: author.trim(),
      edition: edition.trim(),
      condition,
      price: numericPrice,
      status: 'Available'
    });

    const savedListing = await listing.save();

    return res.status(201).json({
      success: true,
      message: 'Available book listed successfully',
      data: savedListing
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create available book listing',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/listings/available
 * @desc    Get all available textbook listings (optional filter by status, bookId, studentId)
 * @access  Public
 */
router.get('/available', async (req, res) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.bookId) {
      filter.bookId = req.query.bookId.trim().toUpperCase();
    }
    if (req.query.studentId && mongoose.Types.ObjectId.isValid(req.query.studentId)) {
      filter.studentId = req.query.studentId;
    }

    const listings = await AvailableBook.find(filter)
      .populate('studentId', 'name email contact')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: listings.length,
      data: listings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch available listings',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/listings/available/:id
 * @desc    Update an available book listing (price, condition, status, edition)
 * @access  Public
 */
router.put('/available/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid listing ID format'
      });
    }

    const listing = await AvailableBook.findById(id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Available book listing not found'
      });
    }

    const { price, condition, status, edition, title, author } = req.body;

    if (price !== undefined) {
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a valid non-negative number'
        });
      }
      listing.price = numPrice;
    }

    if (condition !== undefined) {
      if (!VALID_CONDITIONS.includes(condition)) {
        return res.status(400).json({
          success: false,
          message: `Condition must be one of: ${VALID_CONDITIONS.join(', ')}`
        });
      }
      listing.condition = condition;
    }

    if (status !== undefined) {
      const validStatuses = ['Available', 'Reserved', 'Sold'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be Available, Reserved, or Sold'
        });
      }
      listing.status = status;
    }

    if (edition && edition.trim()) {
      listing.edition = edition.trim();
    }
    if (title && title.trim()) {
      listing.title = title.trim();
    }
    if (author && author.trim()) {
      listing.author = author.trim();
    }

    const updatedListing = await listing.save();

    return res.status(200).json({
      success: true,
      message: 'Available listing updated successfully',
      data: updatedListing
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update available listing',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/listings/available/:id
 * @desc    Delete an available book listing
 * @access  Public
 */
router.delete('/available/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid listing ID format'
      });
    }

    const deletedListing = await AvailableBook.findByIdAndDelete(id);
    if (!deletedListing) {
      return res.status(404).json({
        success: false,
        message: 'Available book listing not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Available book listing deleted successfully',
      data: deletedListing
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete available listing',
      error: error.message
    });
  }
});

// ==========================================
// WANTED BOOK LISTING ROUTES
// ==========================================

/**
 * @route   POST /api/listings/wanted
 * @desc    Create a new wanted textbook listing
 * @access  Public
 */
router.post('/wanted', async (req, res) => {
  try {
    const { title, author, edition, bookId } = req.body;

    // 1. Resolve Student ID
    let resolvedStudentId;
    try {
      resolvedStudentId = await resolveStudent(req.body);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

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

    if (!edition || !edition.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Edition is required'
      });
    }

    // 2. Resolve Book ID via title/alias or create a new Book if not found
    let finalBookId = bookId ? bookId.trim().toUpperCase() : null;

    if (!finalBookId) {
      const existingBook = await findBookByTitleOrAlias(title);
      if (existingBook) {
        finalBookId = existingBook.bookId;
      } else {
        finalBookId = generateBookId();
        const newBookRecord = new Book({
          bookId: finalBookId,
          title: title.trim(),
          author: author.trim(),
          aliases: []
        });
        await newBookRecord.save();
      }
    } else {
      const existingBook = await Book.findOne({ bookId: finalBookId });
      if (!existingBook) {
        const newBookRecord = new Book({
          bookId: finalBookId,
          title: title.trim(),
          author: author.trim(),
          aliases: []
        });
        await newBookRecord.save();
      }
    }

    // 3. Create WantedBook listing
    const listing = new WantedBook({
      studentId: resolvedStudentId,
      bookId: finalBookId,
      title: title.trim(),
      author: author.trim(),
      edition: edition.trim(),
      status: 'Active'
    });

    const savedListing = await listing.save();

    return res.status(201).json({
      success: true,
      message: 'Wanted book listed successfully',
      data: savedListing
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create wanted book listing',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/listings/wanted
 * @desc    Get all wanted textbook listings (optional filter by status, bookId, studentId)
 * @access  Public
 */
router.get('/wanted', async (req, res) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.bookId) {
      filter.bookId = req.query.bookId.trim().toUpperCase();
    }
    if (req.query.studentId && mongoose.Types.ObjectId.isValid(req.query.studentId)) {
      filter.studentId = req.query.studentId;
    }

    const listings = await WantedBook.find(filter)
      .populate('studentId', 'name email contact')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: listings.length,
      data: listings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch wanted listings',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/listings/wanted/:id
 * @desc    Update a wanted book listing (status, edition)
 * @access  Public
 */
router.put('/wanted/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid listing ID format'
      });
    }

    const listing = await WantedBook.findById(id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Wanted book listing not found'
      });
    }

    const { status, edition, title, author } = req.body;

    if (status !== undefined) {
      const validStatuses = ['Active', 'Closed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be either Active or Closed'
        });
      }
      listing.status = status;
    }

    if (edition && edition.trim()) {
      listing.edition = edition.trim();
    }
    if (title && title.trim()) {
      listing.title = title.trim();
    }
    if (author && author.trim()) {
      listing.author = author.trim();
    }

    const updatedListing = await listing.save();

    return res.status(200).json({
      success: true,
      message: 'Wanted listing updated successfully',
      data: updatedListing
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update wanted listing',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/listings/wanted/:id
 * @desc    Delete a wanted book listing
 * @access  Public
 */
router.delete('/wanted/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid listing ID format'
      });
    }

    const deletedListing = await WantedBook.findByIdAndDelete(id);
    if (!deletedListing) {
      return res.status(404).json({
        success: false,
        message: 'Wanted book listing not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Wanted book listing deleted successfully',
      data: deletedListing
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete wanted listing',
      error: error.message
    });
  }
});

module.exports = router;
