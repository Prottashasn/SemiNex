const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  seminarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seminar',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'schedules'
});

module.exports = mongoose.model('Schedule', scheduleSchema); 