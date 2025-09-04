const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Submit feedback for a seminar
router.post('/submit', feedbackController.submitFeedback);

// Get all feedback for a specific seminar
router.get('/seminar/:seminarId', feedbackController.getSeminarFeedback);

// Get feedback statistics for all seminars (admin only)
router.get('/stats', feedbackController.getFeedbackStats);

// Get feedback submitted by a specific user
router.get('/user/:email', feedbackController.getUserFeedback);

// Check if a user has submitted feedback for a seminar
router.get('/check/:seminarId/:email', feedbackController.checkFeedbackStatus);

// Get feedback by ID
router.get('/:id', feedbackController.getFeedbackById);

module.exports = router;