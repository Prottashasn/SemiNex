const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Send registration confirmation email
router.post('/registration-confirmation', notificationController.sendRegistrationConfirmation);

// Send seminar reminder emails to all registrants
router.post('/seminar-reminders', notificationController.sendSeminarReminders);

// Send certificate email
router.post('/certificate', notificationController.sendCertificateEmail);

// Send feedback request emails to all seminar attendees
router.post('/feedback-requests', notificationController.sendFeedbackRequests);

// Send seminar cancellation emails to all registrants
router.post('/cancellation-notices', notificationController.sendCancellationNotices);

module.exports = router;