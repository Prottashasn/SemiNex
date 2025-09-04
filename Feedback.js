const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  registrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration',
    required: true
  },
  seminarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seminar',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  contentQuality: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  speakerEffectiveness: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  organizationQuality: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comments: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  suggestions: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'feedback'
});

// Prevent duplicate feedback submissions
feedbackSchema.index({ registrationId: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);