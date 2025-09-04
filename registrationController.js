const Seminar = require('../model/Seminar');
const Registration = require('../model/Registration');
const emailService = require('../utils/emailService');

// Helper function to check seminar capacity
const checkSeminarCapacity = async (seminarId) => {
  const seminar = await Seminar.findById(seminarId);
  
  if (!seminar) {
    return { success: false, message: 'Seminar not found', status: 404 };
  }
  
  // Check if seminar is archived
  if (seminar.isArchived) {
    return { success: false, message: 'Cannot register for archived seminar', status: 400 };
  }
  
  // Check if seminar is at capacity
  if (seminar.registeredCount >= seminar.capacity) {
    return { 
      success: false, 
      message: 'Seminar has reached maximum capacity', 
      status: 400,
      seminar: {
        id: seminar._id,
        title: seminar.title,
        capacity: seminar.capacity,
        registeredCount: seminar.registeredCount,
        isFull: true
      }
    };
  }
  
  return { 
    success: true, 
    seminar,
    availableSeats: seminar.capacity - seminar.registeredCount
  };
};

// POST /api/registrations
// Body: { name, email, seminarId }
const createRegistration = async (req, res) => {
  try {
    const { name, email, seminarId } = req.body;

    if (!name || !email || !seminarId) {
      return res.status(400).json({ message: 'name, email, and seminarId are required' });
    }

    // Check seminar capacity
    const capacityCheck = await checkSeminarCapacity(seminarId);
    if (!capacityCheck.success) {
      return res.status(capacityCheck.status).json({ 
        message: capacityCheck.message,
        seminar: capacityCheck.seminar
      });
    }
    
    const seminar = capacityCheck.seminar;

    // Prevent duplicate by seminarId + email
    const existing = await Registration.findOne({ seminarId, email: String(email).toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'This email is already registered for the seminar' });
    }

    const registration = new Registration({
      seminarId,
      studentName: name,
      studentId: req.body.studentId || email.split('@')[0], // Use provided studentId or email prefix
      email,
      department: req.body.department || 'General', // Use provided department or default
      registrationDate: new Date()
    });

    const saved = await registration.save().catch(err => {
      if (err && err.code === 11000) {
        return null;
      }
      throw err;
    });

    if (!saved) {
      return res.status(409).json({ message: 'This email is already registered for the seminar' });
    }
    
    // Update seminar registeredCount
    await Seminar.findByIdAndUpdate(seminarId, { $inc: { registeredCount: 1 } });

    // Send confirmation email
    try {
      await emailService.sendRegistrationConfirmation(saved, seminar);
      console.log('Confirmation email sent successfully');
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the registration if email fails
    }

    return res.status(201).json({
      message: 'Registration successful',
      registration: {
        id: saved._id,
        name: saved.studentName,
        email: saved.email,
        seminarId: saved.seminarId,
        timestamp: saved.registrationDate
      }
    });
  } catch (error) {
    console.error('Create registration error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Cancel a registration
const cancelRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the registration
    const registration = await Registration.findById(id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    // Get the seminar ID before deleting the registration
    const seminarId = registration.seminarId;
    
    // Delete the registration
    await Registration.findByIdAndDelete(id);
    
    // Decrement the seminar's registeredCount
    await Seminar.findByIdAndUpdate(seminarId, { $inc: { registeredCount: -1 } });
    
    return res.status(200).json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    console.error('Cancel registration error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all registrations for a seminar
const getSeminarRegistrations = async (req, res) => {
  try {
    const { seminarId } = req.params;
    
    // Validate seminar existence
    const capacityCheck = await checkSeminarCapacity(seminarId);
    if (!capacityCheck.success && capacityCheck.status !== 400) {
      return res.status(capacityCheck.status).json({ message: capacityCheck.message });
    }
    
    // Get all registrations for this seminar
    const registrations = await Registration.find({ seminarId }).sort({ registrationDate: -1 });
    
    return res.status(200).json({
      registrations,
      count: registrations.length,
      seminarCapacity: capacityCheck.success ? capacityCheck.seminar.capacity : null,
      availableSeats: capacityCheck.success ? capacityCheck.availableSeats : 0
    });
  } catch (error) {
    console.error('Get seminar registrations error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Check if a user is registered for a seminar
const checkRegistrationStatus = async (req, res) => {
  try {
    const { seminarId, email } = req.params;
    
    // Find registration
    const registration = await Registration.findOne({ 
      seminarId, 
      email: String(email).toLowerCase() 
    });
    
    return res.status(200).json({
      isRegistered: !!registration,
      registration: registration ? {
        id: registration._id,
        name: registration.studentName,
        email: registration.email,
        registrationDate: registration.registrationDate
      } : null
    });
  } catch (error) {
    console.error('Check registration status error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all registrations for a user by email
const getUserRegistrations = async (req, res) => {
  try {
    const { email } = req.params;
    
    // Find all registrations for this user
    const registrations = await Registration.find({ 
      email: String(email).toLowerCase() 
    }).sort({ registrationDate: -1 });
    
    return res.status(200).json({
      registrations,
      count: registrations.length,
      userEmail: email
    });
  } catch (error) {
    console.error('Get user registrations error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  createRegistration, 
  cancelRegistration,
  getSeminarRegistrations,
  checkRegistrationStatus,
  getUserRegistrations
};




