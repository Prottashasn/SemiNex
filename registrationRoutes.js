const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { protect, adminOnly } = require('../middleware/auth');

// Create a new registration
router.post('/', registrationController.createRegistration);

// Cancel a registration
router.delete('/:id', registrationController.cancelRegistration);

// Get all registrations for a seminar (admin only)
router.get('/seminar/:seminarId', protect, adminOnly, registrationController.getSeminarRegistrations);

// Check if a user is registered for a seminar
router.get('/check/:seminarId/:email', registrationController.checkRegistrationStatus);

// Get all registrations for a user by email
router.get('/user/:email', registrationController.getUserRegistrations);

module.exports = router;