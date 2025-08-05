const Seminar = require('../model/Seminar');
const Schedule = require('../model/Schedule');

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
    const seminars = await Seminar.find({}).sort({ createdAt: -1 });
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
    res.json({ seminar });
  } catch (error) {
    console.error('Get seminar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update seminar
const updateSeminar = async (req, res) => {
  try {
    const { title, speaker, topic, description, venue } = req.body;
    
    const seminar = await Seminar.findByIdAndUpdate(
      req.params.id,
      { title, speaker, topic, description, venue },
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

module.exports = {
  createSeminar,
  getAllSeminars,
  getSeminarById,
  updateSeminar,
  deleteSeminar,
  createSchedule,
  getAllSchedules,
  updateSchedule,
  deleteSchedule
}; 