const Speaker = require('../model/Speaker');

// Create a new speaker
const createSpeaker = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      organization,
      designation,
      bio,
      expertise,
      experience,
      linkedin,
      website
    } = req.body;

    // Check if speaker with same email already exists
    const existingSpeaker = await Speaker.findOne({ email });
    if (existingSpeaker) {
      return res.status(400).json({ message: 'Speaker with this email already exists' });
    }

    const speaker = new Speaker({
      name,
      email,
      phone,
      organization,
      designation,
      bio,
      expertise,
      experience,
      linkedin,
      website
    });

    const savedSpeaker = await speaker.save();

    res.status(201).json({
      message: 'Speaker created successfully',
      speaker: savedSpeaker
    });
  } catch (error) {
    console.error('Create speaker error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all speakers
const getAllSpeakers = async (req, res) => {
  try {
    const speakers = await Speaker.find({}).sort({ createdAt: -1 });
    res.json({ speakers });
  } catch (error) {
    console.error('Get speakers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get speaker by ID
const getSpeakerById = async (req, res) => {
  try {
    const speaker = await Speaker.findById(req.params.id);
    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found' });
    }
    res.json({ speaker });
  } catch (error) {
    console.error('Get speaker error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update speaker
const updateSpeaker = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      organization,
      designation,
      bio,
      expertise,
      experience,
      linkedin,
      website
    } = req.body;
    
    const speaker = await Speaker.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        organization,
        designation,
        bio,
        expertise,
        experience,
        linkedin,
        website
      },
      { new: true }
    );

    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found' });
    }

    res.json({
      message: 'Speaker updated successfully',
      speaker
    });
  } catch (error) {
    console.error('Update speaker error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete speaker
const deleteSpeaker = async (req, res) => {
  try {
    const speaker = await Speaker.findByIdAndDelete(req.params.id);
    
    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found' });
    }

    res.json({ message: 'Speaker deleted successfully' });
  } catch (error) {
    console.error('Delete speaker error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createSpeaker,
  getAllSpeakers,
  getSpeakerById,
  updateSpeaker,
  deleteSpeaker
}; 