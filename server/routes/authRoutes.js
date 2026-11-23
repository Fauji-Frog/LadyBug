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
    const { fullName, name, email, studentId, department, batch, phone, contact } = req.body;

    const studentName = (fullName || name || '').trim();
    const studentEmail = (email || '').trim().toLowerCase();

    if (!studentName) {
      return res.status(400).json({
        success: false,
        message: 'Student name is required'
      });
    }

    if (!studentEmail) {
      return res.status(400).json({
        success: false,
        message: 'University email is required'
      });
    }

    const existing = await Student.findOne({ email: studentEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A student with this university email is already registered'
      });
    }

    const student = new Student({
      name: studentName,
      email: studentEmail,
      contact: (phone || contact || 'N/A').trim(),
      department: (department || 'General Academic').trim(),
      batch: (batch || 'Class of 2026').trim()
    });

    const savedStudent = await student.save();

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully on ReLeaf',
      user: {
        id: savedStudent._id,
        fullName: savedStudent.name,
        email: savedStudent.email,
        contact: savedStudent.contact,
        department: savedStudent.department,
        batch: savedStudent.batch
      },
      token: `releaf-jwt-${savedStudent._id}`
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
 * @desc    Student login by email or identifier
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { identifier, email } = req.body;
    const searchTarget = (identifier || email || '').trim().toLowerCase();

    if (!searchTarget) {
      return res.status(400).json({
        success: false,
        message: 'Email or Student ID is required to login'
      });
    }

    const student = await Student.findOne({
      $or: [
        { email: searchTarget },
        { contact: searchTarget }
      ]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'No student found with these credentials'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful on ReLeaf',
      user: {
        id: student._id,
        fullName: student.name,
        email: student.email,
        contact: student.contact,
        department: student.department || 'General Academic',
        batch: student.batch || 'Class of 2026'
      },
      token: `releaf-jwt-${student._id}`
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
