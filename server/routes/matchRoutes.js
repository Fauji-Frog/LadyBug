const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

/**
 * Match Routes
 * Base URL: /api/matches
 */

// API 1: Run automatic matching service
// POST /api/matches/run
router.post('/run', matchController.runMatching);

// API 2: Get all matches in the system
// GET /api/matches
router.get('/', matchController.getAllMatches);

// API 3: Get matches for a specific student (as buyer or seller)
// GET /api/matches/:studentId
router.get('/:studentId', matchController.getStudentMatches);

module.exports = router;
