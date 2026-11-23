const mongoose = require('mongoose');

// Student Schema definition for ReLeaf platform
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Student email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    studentId: {
      type: String,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Student password is required']
    },
    contact: {
      type: String,
      trim: true,
      default: ''
    },
    department: {
      type: String,
      default: 'General Academic'
    },
    batch: {
      type: String,
      default: 'Class of 2026'
    }
  },
  {
    timestamps: true
  }
);

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
