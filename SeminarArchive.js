const mongoose = require('mongoose');

const seminarArchiveSchema = new mongoose.Schema({
  originalSeminarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seminar',
    required: true
  },
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
    required: true
  },
  venue: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  totalAttendees: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  materials: [{
    type: String,
    trim: true
  }],
  recordingUrl: {
    type: String,
    trim: true
  },
  archivedAt: {
    type: Date,
    default: Date.now
  },
  archivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SeminarArchive', seminarArchiveSchema);