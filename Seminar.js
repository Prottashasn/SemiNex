// backend/models/Seminar.js
const mongoose = require('mongoose');

const seminarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  speaker: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  topic: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  date: {
    type: Date,
    required: false
  },
  time: {
    type: String,
    required: false
  },
  venue: {
    type: String,
    required: false,
    trim: true,
    maxlength: 200
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  registeredCount: {
    type: Number,
    default: 0
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedAt: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Seminar', seminarSchema);