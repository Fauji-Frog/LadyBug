const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new student account
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, contact } = req.body;

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

    const cleanEmail = email.trim().toLowerCase();
    const existing = await Student.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A student with this email is already registered'
      });
    }

    const student = new Student({
      name: name.trim(),
      email: cleanEmail,
      contact: contact ? contact.trim() : 'N/A'
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
      message: 'Authentication registration error',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Student login by email
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required to login'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const student = await Student.findOne({ email: cleanEmail });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'No student found with this email'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: student
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication login error',
      error: error.message
    });
  }
});

module.exports = router;
