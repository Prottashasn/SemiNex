const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  seminarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seminar',
    required: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  studentId: {
    type: String,
    required: false,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  department: {
    type: String,
    required: false,
    trim: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'registrations'
});

// Prevent duplicate registrations per seminar by email
registrationSchema.index({ seminarId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);


