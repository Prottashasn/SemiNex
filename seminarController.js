const Seminar = require('../model/Seminar');
const Schedule = require('../model/Schedule');
const Registration = require('../model/Registration');

// Create a new seminar
const createSeminar = async (req, res) => {
  try {
    const { title, speaker, topic, description, venue } = req.body;

    const seminar = new Seminar({
      title,
      speaker,
      topic,
      description,
      venue
    });

    const savedSeminar = await seminar.save();

    res.status(201).json({
      message: 'Seminar created successfully',
      seminar: savedSeminar
    });
  } catch (error) {
    console.error('Create seminar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all seminars
const getAllSeminars = async (req, res) => {
  try {
    // Check if we should include archived seminars
    const includeArchived = req.query.includeArchived === 'true';
    
    // Filter out archived seminars by default
    const filter = includeArchived ? {} : { isArchived: { $ne: true } };
    
    const seminars = await Seminar.find(filter).sort({ createdAt: -1 });
    res.json({ seminars });
  } catch (error) {
    console.error('Get seminars error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get seminar by ID
const getSeminarById = async (req, res) => {
  try {
    const seminar = await Seminar.findById(req.params.id);
    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }
    
    // If the seminar is archived, include that information in the response
    if (seminar.isArchived) {
      return res.json({ 
        seminar,
        isArchived: true,
        archivedAt: seminar.archivedAt,
        message: 'This seminar has been archived'
      });
    }
    
    res.json({ seminar });
  } catch (error) {
    console.error('Get seminar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update seminar
const updateSeminar = async (req, res) => {
  try {
    const { title, speaker, topic, description, venue, capacity } = req.body;
    
    // If capacity is being updated, ensure it's not less than current registeredCount
    if (capacity !== undefined) {
      const currentSeminar = await Seminar.findById(req.params.id);
      if (!currentSeminar) {
        return res.status(404).json({ message: 'Seminar not found' });
      }
      
      if (capacity < currentSeminar.registeredCount) {
        return res.status(400).json({ 
          message: 'Cannot reduce capacity below current registration count',
          currentRegistrations: currentSeminar.registeredCount
        });
      }
    }
    
    const seminar = await Seminar.findByIdAndUpdate(
      req.params.id,
      { title, speaker, topic, description, venue, capacity },
      { new: true }
    );

    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }

    res.json({
      message: 'Seminar updated successfully',
      seminar
    });
  } catch (error) {
    console.error('Update seminar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete seminar
const deleteSeminar = async (req, res) => {
  try {
    const seminar = await Seminar.findByIdAndDelete(req.params.id);
    
    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }

    // Also delete associated schedules
    await Schedule.deleteMany({ seminarId: req.params.id });

    res.json({ message: 'Seminar deleted successfully' });
  } catch (error) {
    console.error('Delete seminar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a schedule for a seminar
const createSchedule = async (req, res) => {
  try {
    const { seminarId, date, time } = req.body;

    // Check if seminar exists
    const seminar = await Seminar.findById(seminarId);
    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }

    const schedule = new Schedule({
      seminarId,
      date,
      time
    });

    const savedSchedule = await schedule.save();

    res.status(201).json({
      message: 'Schedule created successfully',
      schedule: savedSchedule
    });
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all schedules with seminar details
const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({})
      .populate('seminarId', 'title speaker topic')
      .sort({ date: 1, time: 1 });

    res.json({ schedules });
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update schedule
const updateSchedule = async (req, res) => {
  try {
    const { date, time, isActive } = req.body;
    
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { date, time, isActive },
      { new: true }
    ).populate('seminarId', 'title speaker topic');

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.json({
      message: 'Schedule updated successfully',
      schedule
    });
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete schedule
const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get seminar capacity status
const getSeminarCapacityStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const seminar = await Seminar.findById(id);
    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }
    
    const capacityStatus = {
      seminarId: seminar._id,
      title: seminar.title,
      capacity: seminar.capacity,
      registeredCount: seminar.registeredCount,
      availableSeats: seminar.capacity - seminar.registeredCount,
      isFull: seminar.registeredCount >= seminar.capacity,
      percentageFilled: Math.round((seminar.registeredCount / seminar.capacity) * 100)
    };
    
    res.json({ capacityStatus });
  } catch (error) {
    console.error('Get seminar capacity status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createSeminar,
  getAllSeminars,
  getSeminarById,
  updateSeminar,
  deleteSeminar,
  createSchedule,
  getAllSchedules,
  updateSchedule,
  deleteSchedule,
  getSeminarCapacityStatus,
  // Register a participant for a seminar
  registerParticipant: async (req, res) => {
    try {
      const { seminarId } = req.params;
      const { studentName, studentId, email, department } = req.body;

      // 1) Check seminar existence
      const seminar = await Seminar.findById(seminarId);
      if (!seminar) {
        return res.status(404).json({ message: 'Seminar not found' });
      }

      // 2) Prevent duplicate registration per seminar by email
      const existing = await Registration.findOne({
        seminarId,
        email: String(email).toLowerCase()
      });
      if (existing) {
        return res.status(409).json({
          message: 'This email is already registered for the seminar'
        });
      }

      // 3) Create registration
      const registration = new Registration({
        seminarId,
        studentName,
        studentId,
        email,
        department,
        registrationDate: new Date()
      });

      const saved = await registration.save().catch(err => {
        // Handle race on unique index
        if (err && err.code === 11000) {
          return null;
        }
        throw err;
      });

      if (!saved) {
        return res.status(409).json({
          message: 'This email is already registered for the seminar'
        });
      }
      
      // Update seminar registeredCount
      await Seminar.findByIdAndUpdate(seminarId, { $inc: { registeredCount: 1 } });

      return res.status(201).json({
        message: 'Registration successful',
        registration: saved
      });
    } catch (error) {
      console.error('Register participant error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
};