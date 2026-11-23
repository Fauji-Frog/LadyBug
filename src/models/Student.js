const mongoose = require('mongoose');

// Student Schema definition
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
    contact: {
      type: String,
      required: [true, 'Contact number or information is required'],
      trim: true
    }
  },
  {
    timestamps: true // Automatically creates createdAt and updatedAt fields
  }
);

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
