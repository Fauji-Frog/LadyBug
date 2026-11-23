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
    const { fullName, name, email, studentId, department, batch, phone, contact, password } = req.body;

    const studentName = (fullName || name || '').trim();
    const studentEmail = (email || '').trim().toLowerCase();
    const studentIdCode = (studentId || '').trim();
    const studentPassword = (password || '').trim();

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

    if (!studentPassword || studentPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password is required and must be at least 6 characters'
      });
    }

    const existing = await Student.findOne({
      $or: [
        { email: studentEmail },
        ...(studentIdCode ? [{ studentId: studentIdCode }] : [])
      ]
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A student with this university email or Student ID is already registered. Please log in.'
      });
    }

    const student = new Student({
      name: studentName,
      email: studentEmail,
      studentId: studentIdCode,
      password: studentPassword,
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
        studentId: savedStudent.studentId,
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
    const { identifier, email, studentId, password } = req.body;
    const searchTarget = (identifier || email || studentId || '').trim().toLowerCase();
    const inputPassword = (password || '').trim();

    if (!searchTarget) {
      return res.status(400).json({
        success: false,
        message: 'Email or Student ID is required to login'
      });
    }

    if (!inputPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to login'
      });
    }

    const student = await Student.findOne({
      $or: [
        { email: searchTarget },
        { studentId: searchTarget },
        { contact: searchTarget }
      ]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'No student account found with these credentials. Please sign up first.'
      });
    }

    // Verify password if student has a password stored
    if (student.password && student.password !== inputPassword) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please verify your password and try again.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful on ReLeaf',
      user: {
        id: student._id,
        fullName: student.name,
        email: student.email,
        studentId: student.studentId,
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
