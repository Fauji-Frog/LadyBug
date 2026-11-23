const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Student = require('../models/Student');

/**
 * @route   POST /api/students
 * @desc    Register a new student
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, contact } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Student name is required'
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Student email is required'
      });
    }

    if (!contact || !contact.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Student contact information is required'
      });
    }

    // Check if email already exists
    const existingStudent = await Student.findOne({ email: email.trim().toLowerCase() });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'A student with this email already exists'
      });
    }

    // Create new student
    const student = new Student({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      contact: contact.trim()
    });

    const savedStudent = await student.save();

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: savedStudent
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create student',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/students
 * @desc    Get all students
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/students/:id
 * @desc    Get a single student by MongoDB ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID format'
      });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch student',
      error: error.message
    });
  }
});

module.exports = router;
