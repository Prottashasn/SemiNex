const mongoose = require('mongoose');

const seminarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  speaker: {
    type: String,
    required: true,
    trim: true
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  venue: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'seminars'
});

module.exports = mongoose.model('Seminar', seminarSchema); 