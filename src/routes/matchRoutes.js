const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Match = require('../models/Match');

/**
 * @route   POST /api/matches
 * @desc    Create a new match record (for integration with matching module)
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const {
      buyerId,
      sellerId,
      availableBookId,
      wantedBookId,
      bookId,
      edition,
      status
    } = req.body;

    // Validate IDs
    if (!buyerId || !mongoose.Types.ObjectId.isValid(buyerId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid Buyer Student ID is required'
      });
    }

    if (!sellerId || !mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid Seller Student ID is required'
      });
    }

    if (!availableBookId || !mongoose.Types.ObjectId.isValid(availableBookId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid Available Book ID is required'
      });
    }

    if (!wantedBookId || !mongoose.Types.ObjectId.isValid(wantedBookId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid Wanted Book ID is required'
      });
    }

    if (!bookId || !bookId.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Book ID is required'
      });
    }

    if (!edition || !edition.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Book edition is required'
      });
    }

    const match = new Match({
      buyerId,
      sellerId,
      availableBookId,
      wantedBookId,
      bookId: bookId.trim().toUpperCase(),
      edition: edition.trim(),
      status: status || 'Pending'
    });

    const savedMatch = await match.save();

    return res.status(201).json({
      success: true,
      message: 'Match recorded successfully',
      data: savedMatch
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to record match',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/matches
 * @desc    Get all recorded matches
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('buyerId', 'name email contact')
      .populate('sellerId', 'name email contact')
      .populate('availableBookId')
      .populate('wantedBookId')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch matches',
      error: error.message
    });
  }
});

module.exports = router;
