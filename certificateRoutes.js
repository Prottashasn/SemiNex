const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');

// Generate certificate for a registration
router.post('/generate', certificateController.generateCertificate);

// Generate certificates in bulk for a seminar
router.post('/generate-bulk', certificateController.generateBulkCertificates);

// Get certificate by ID
router.get('/:id', certificateController.getCertificateById);

// Verify certificate by certificate number and verification code
router.post('/verify', certificateController.verifyCertificate);

// Get all certificates for a student by email
router.get('/student/:email', certificateController.getStudentCertificates);

// Get all certificates for a seminar
router.get('/seminar/:seminarId', certificateController.getSeminarCertificates);

// Revoke a certificate
router.put('/revoke/:id', certificateController.revokeCertificate);

module.exports = router;