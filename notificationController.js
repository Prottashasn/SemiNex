const emailService = require('../utils/emailService');
const Registration = require('../model/Registration');
const Seminar = require('../model/Seminar');
const Certificate = require('../model/Certificate');

// Send registration confirmation email
exports.sendRegistrationConfirmation = async (req, res) => {
  try {
    const { registrationId } = req.body;

    // Get registration details
    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Get seminar details
    const seminar = await Seminar.findById(registration.seminarId);
    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }

    // Send confirmation email
    await emailService.sendRegistrationConfirmation(registration, seminar);

    res.status(200).json({ message: 'Registration confirmation email sent successfully' });
  } catch (error) {
    console.error('Send registration confirmation email error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send seminar reminder emails to all registrants
exports.sendSeminarReminders = async (req, res) => {
  try {
    const { seminarId } = req.body;

    // Get seminar details
    const seminar = await Seminar.findById(seminarId);
    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }

    // Get all registrations for this seminar
    const registrations = await Registration.find({ seminarId });
    if (registrations.length === 0) {
      return res.status(404).json({ message: 'No registrations found for this seminar' });
    }

    // Send reminder emails
    const results = { success: 0, failed: 0 };
    for (const registration of registrations) {
      try {
        await emailService.sendSeminarReminder(registration, seminar);
        results.success++;
      } catch (error) {
        console.error(`Error sending reminder email to ${registration.email}:`, error);
        results.failed++;
      }
    }

    res.status(200).json({
      message: 'Seminar reminder emails sent',
      results
    });
  } catch (error) {
    console.error('Send seminar reminders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send certificate email
exports.sendCertificateEmail = async (req, res) => {
  try {
    const { certificateId } = req.body;

    // Get certificate details
    const certificate = await Certificate.findById(certificateId);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Get registration details
    const registration = await Registration.findById(certificate.registrationId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Get seminar details
    const seminar = await Seminar.findById(certificate.seminarId);
    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }

    // Send certificate email
    await emailService.sendCertificateEmail(certificate, registration, seminar);

    res.status(200).json({ message: 'Certificate email sent successfully' });
  } catch (error) {
    console.error('Send certificate email error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send feedback request emails to all seminar attendees
exports.sendFeedbackRequests = async (req, res) => {
  try {
    const { seminarId } = req.body;

    // Get seminar details
    const seminar = await Seminar.findById(seminarId);
    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }

    // Get all registrations for this seminar
    const registrations = await Registration.find({ seminarId });
    if (registrations.length === 0) {
      return res.status(404).json({ message: 'No registrations found for this seminar' });
    }

    // Send feedback request emails
    const results = { success: 0, failed: 0 };
    for (const registration of registrations) {
      try {
        await emailService.sendFeedbackRequest(registration, seminar);
        results.success++;
      } catch (error) {
        console.error(`Error sending feedback request email to ${registration.email}:`, error);
        results.failed++;
      }
    }

    res.status(200).json({
      message: 'Feedback request emails sent',
      results
    });
  } catch (error) {
    console.error('Send feedback requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send seminar cancellation emails to all registrants
exports.sendCancellationNotices = async (req, res) => {
  try {
    const { seminarId } = req.body;

    // Get seminar details
    const seminar = await Seminar.findById(seminarId);
    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }

    // Get all registrations for this seminar
    const registrations = await Registration.find({ seminarId });
    if (registrations.length === 0) {
      return res.status(404).json({ message: 'No registrations found for this seminar' });
    }

    // Send cancellation emails
    const results = { success: 0, failed: 0 };
    for (const registration of registrations) {
      try {
        await emailService.sendSeminarCancellation(registration, seminar);
        results.success++;
      } catch (error) {
        console.error(`Error sending cancellation email to ${registration.email}:`, error);
        results.failed++;
      }
    }

    res.status(200).json({
      message: 'Seminar cancellation emails sent',
      results
    });
  } catch (error) {
    console.error('Send cancellation notices error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};