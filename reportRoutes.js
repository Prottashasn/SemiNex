const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect, adminOnly } = require('../middleware/auth');

// All report routes should be admin-only

// Get overall system statistics
router.get('/system-stats', protect, adminOnly, reportController.getSystemStats);

// Get seminar attendance report
router.get('/attendance', protect, adminOnly, reportController.getSeminarAttendanceReport);

// Get feedback statistics
router.get('/feedback', protect, adminOnly, reportController.getFeedbackStats);

// Get monthly registration trends
router.get('/trends', protect, adminOnly, reportController.getRegistrationTrends);

module.exports = router;