const Certificate = require('../model/Certificate');
const Registration = require('../model/Registration');
const Seminar = require('../model/Seminar');
const crypto = require('crypto');

// Generate a unique certificate number
const generateCertificateNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `SEMINEX-${timestamp.slice(-6)}-${random}`;
};

// Generate a verification code
const generateVerificationCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Generate certificate for a registration
exports.generateCertificate = async (req, res) => {
  try {
    const { registrationId } = req.body;

    // Check if registration exists
    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({ registrationId });
    if (existingCertificate) {
      return res.status(400).json({ 
        message: 'Certificate already generated for this registration',
        certificate: existingCertificate
      });
    }

    // Get seminar details
    const seminar = await Seminar.findById(registration.seminarId);
    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }

    // Create certificate
    const certificate = new Certificate({
      registrationId,
      seminarId: registration.seminarId,
      studentName: registration.studentName,
      seminarTitle: seminar.title,
      certificateNumber: generateCertificateNumber(),
      verificationCode: generateVerificationCode()
    });

    const savedCertificate = await certificate.save();

    res.status(201).json({
      message: 'Certificate generated successfully',
      certificate: savedCertificate
    });
  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate certificates in bulk for a seminar
exports.generateBulkCertificates = async (req, res) => {
  try {
    const { seminarId } = req.body;

    // Check if seminar exists
    const seminar = await Seminar.findById(seminarId);
    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }

    // Get all registrations for this seminar
    const registrations = await Registration.find({ seminarId });
    if (registrations.length === 0) {
      return res.status(404).json({ message: 'No registrations found for this seminar' });
    }

    // Generate certificates for each registration
    const results = { success: 0, alreadyExists: 0, failed: 0 };
    const certificates = [];

    for (const registration of registrations) {
      try {
        // Check if certificate already exists
        const existingCertificate = await Certificate.findOne({ registrationId: registration._id });
        if (existingCertificate) {
          results.alreadyExists++;
          continue;
        }

        // Create certificate
        const certificate = new Certificate({
          registrationId: registration._id,
          seminarId,
          studentName: registration.studentName,
          seminarTitle: seminar.title,
          certificateNumber: generateCertificateNumber(),
          verificationCode: generateVerificationCode()
        });

        const savedCertificate = await certificate.save();
        certificates.push(savedCertificate);
        results.success++;
      } catch (error) {
        console.error(`Error generating certificate for registration ${registration._id}:`, error);
        results.failed++;
      }
    }

    res.status(200).json({
      message: 'Bulk certificate generation completed',
      results,
      certificates
    });
  } catch (error) {
    console.error('Bulk generate certificates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get certificate by ID
exports.getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('seminarId', 'title date speaker venue')
      .populate('registrationId', 'studentName email');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json({ certificate });
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify certificate by certificate number and verification code
exports.verifyCertificate = async (req, res) => {
  try {
    const { certificateNumber, verificationCode } = req.body;

    const certificate = await Certificate.findOne({
      certificateNumber,
      verificationCode
    }).populate('seminarId', 'title date speaker venue');

    if (!certificate) {
      return res.status(404).json({ 
        message: 'Certificate not found or verification code is incorrect',
        isValid: false
      });
    }

    if (certificate.status === 'revoked') {
      return res.status(400).json({
        message: 'Certificate has been revoked',
        isValid: false,
        certificate
      });
    }

    res.json({
      message: 'Certificate is valid',
      isValid: true,
      certificate
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all certificates for a student by email
exports.getStudentCertificates = async (req, res) => {
  try {
    const { email } = req.params;

    // Find registrations by email
    const registrations = await Registration.find({ email });
    const registrationIds = registrations.map(reg => reg._id);

    // Find certificates for these registrations
    const certificates = await Certificate.find({
      registrationId: { $in: registrationIds }
    }).populate('seminarId', 'title date speaker venue');

    res.json({ certificates });
  } catch (error) {
    console.error('Get student certificates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all certificates for a seminar
exports.getSeminarCertificates = async (req, res) => {
  try {
    const { seminarId } = req.params;

    const certificates = await Certificate.find({ seminarId })
      .populate('registrationId', 'studentName email');

    res.json({ certificates });
  } catch (error) {
    console.error('Get seminar certificates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Revoke a certificate
exports.revokeCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    certificate.status = 'revoked';
    await certificate.save();

    res.json({
      message: 'Certificate revoked successfully',
      certificate
    });
  } catch (error) {
    console.error('Revoke certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};