const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
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
  studentName: {
    type: String,
    required: true
  },
  seminarTitle: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  certificateNumber: {
    type: String,
    required: true,
    unique: true
  },
  verificationCode: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['issued', 'revoked'],
    default: 'issued'
  }
}, {
  timestamps: true,
  collection: 'certificates'
});

// Prevent duplicate certificates
certificateSchema.index({ registrationId: 1 }, { unique: true });

module.exports = mongoose.model('Certificate', certificateSchema);