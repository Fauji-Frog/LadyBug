const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const AvailableBook = require('../models/AvailableBook');
const WantedBook = require('../models/WantedBook');
const Student = require('../models/Student');
const Book = require('../models/Book');
const { findBookByTitleOrAlias, generateBookId } = require('../utils/bookHelper');
const { findAndCreateMatches } = require('../services/matchingService');

const VALID_CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor', 'Used'];

/**
 * Helper to resolve or auto-create a student from listing payloads.
 */
async function resolveStudent(body) {
  const { studentId, studentName, name, sellerName, buyerName, sellerContact, contact, phone, email } = body;

  if (studentId && mongoose.Types.ObjectId.isValid(studentId)) {
    const student = await Student.findById(studentId);
    if (student) return student;
  }

  const chosenName = (studentName || sellerName || buyerName || name || 'Student').trim();
  const chosenContact = (sellerContact || contact || phone || email || 'student@university.edu').trim();

  let student = await Student.findOne({
    $or: [
      { contact: chosenContact },
      { email: chosenContact.toLowerCase() }
    ]
  });

  if (!student) {
    const generatedEmail = chosenContact.includes('@')
      ? chosenContact.toLowerCase()
      : `student.${Date.now()}@university.edu`;

    student = new Student({
      name: chosenName,
      email: generatedEmail,
      contact: chosenContact
    });
    await student.save();
  }

  return student;
}

// ==========================================
// AVAILABLE BOOK LISTINGS
// ==========================================

/**
 * @route   POST /api/listings/available
 * @desc    Create a new available textbook listing and trigger matching
 * @access  Public
 */
router.post('/available', async (req, res) => {
  try {
    const { title, bookTitle, author, edition, condition, price, bookId, pickupLocation, description } = req.body;

    const chosenTitle = (title || bookTitle || '').trim();
    if (!chosenTitle) {
      return res.status(400).json({ success: false, message: 'Book title is required' });
    }

    if (!edition || !edition.trim()) {
      return res.status(400).json({ success: false, message: 'Edition is required' });
    }

    if (price === undefined || price === null || price === '') {
      return res.status(400).json({ success: false, message: 'Price is required for available listings' });
    }

    const student = await resolveStudent(req.body);

    // Resolve or generate Book ID
    let finalBookId = bookId ? bookId.trim().toUpperCase() : null;
    if (!finalBookId) {
      const existingBook = await findBookByTitleOrAlias(chosenTitle);
      if (existingBook) {
        finalBookId = existingBook.bookId;
      } else {
        finalBookId = generateBookId();
        const newBookRecord = new Book({
          bookId: finalBookId,
          title: chosenTitle,
          author: (author || 'Academic Author').trim()
        });
        await newBookRecord.save();
      }
    }

    const listing = new AvailableBook({
      bookId: finalBookId,
      bookTitle: chosenTitle,
      title: chosenTitle,
      author: (author || 'Academic Author').trim(),
      edition: edition.trim(),
      condition: condition || 'Good',
      price: Number(price),
      sellerId: String(student._id),
      sellerName: student.name,
      studentId: student._id,
      sellerContact: student.contact,
      pickupLocation: pickupLocation || 'Main Campus Library',
      description: description || '',
      status: 'Available'
    });

    const savedListing = await listing.save();

    // Trigger matching engine automatically (Part 15 Requirement)
    let matchResults = null;
    try {
      matchResults = await findAndCreateMatches();
    } catch (matchErr) {
      console.warn('Auto-matching notification error:', matchErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Available book listed successfully on ReLeaf',
      data: savedListing,
      matchesTriggered: matchResults ? matchResults.matchesCreated : 0
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create available listing',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/listings/available
 * @desc    Get all available textbook listings
 * @access  Public
 */
router.get('/available', async (req, res) => {
  try {
    const filter = { status: 'Available' };
    if (req.query.bookId) filter.bookId = req.query.bookId.trim().toUpperCase();

    const listings = await AvailableBook.find(filter).sort({ createdAt: -1 });

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

// ==========================================
// WANTED BOOK LISTINGS
// ==========================================

/**
 * @route   POST /api/listings/wanted
 * @desc    Create a new wanted textbook listing and trigger matching
 * @access  Public
 */
router.post('/wanted', async (req, res) => {
  try {
    const { title, bookTitle, author, edition, bookId, urgency, notes } = req.body;

    const chosenTitle = (title || bookTitle || '').trim();
    if (!chosenTitle) {
      return res.status(400).json({ success: false, message: 'Book title is required' });
    }

    if (!edition || !edition.trim()) {
      return res.status(400).json({ success: false, message: 'Edition is required' });
    }

    const student = await resolveStudent(req.body);

    let finalBookId = bookId ? bookId.trim().toUpperCase() : null;
    if (!finalBookId) {
      const existingBook = await findBookByTitleOrAlias(chosenTitle);
      if (existingBook) {
        finalBookId = existingBook.bookId;
      } else {
        finalBookId = generateBookId();
        const newBookRecord = new Book({
          bookId: finalBookId,
          title: chosenTitle,
          author: (author || 'Academic Author').trim()
        });
        await newBookRecord.save();
      }
    }

    const listing = new WantedBook({
      bookId: finalBookId,
      bookTitle: chosenTitle,
      title: chosenTitle,
      author: (author || 'Academic Author').trim(),
      edition: edition.trim(),
      buyerId: String(student._id),
      buyerName: student.name,
      studentId: student._id,
      contact: student.contact,
      urgency: urgency || 'Medium',
      notes: notes || '',
      status: 'Active'
    });

    const savedListing = await listing.save();

    // Trigger matching engine automatically (Part 15 Requirement)
    let matchResults = null;
    try {
      matchResults = await findAndCreateMatches();
    } catch (matchErr) {
      console.warn('Auto-matching notification error:', matchErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Wanted book requested successfully on ReLeaf',
      data: savedListing,
      matchesTriggered: matchResults ? matchResults.matchesCreated : 0
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create wanted listing',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/listings/wanted
 * @desc    Get all wanted textbook listings
 * @access  Public
 */
router.get('/wanted', async (req, res) => {
  try {
    const filter = { status: 'Active' };
    if (req.query.bookId) filter.bookId = req.query.bookId.trim().toUpperCase();

    const listings = await WantedBook.find(filter).sort({ createdAt: -1 });

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

module.exports = router;
