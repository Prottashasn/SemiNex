const Feedback = require('../model/Feedback');
const Registration = require('../model/Registration');
const Seminar = require('../model/Seminar');

// Submit feedback for a seminar
exports.submitFeedback = async (req, res) => {
  try {
    const { registrationId, seminarId, rating, contentQuality, speakerEffectiveness, organizationQuality, comments, suggestions } = req.body;

    // Verify that the registration exists and belongs to this seminar
    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (registration.seminarId.toString() !== seminarId) {
      return res.status(400).json({ message: 'Registration does not match the seminar' });
    }

    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({ registrationId });
    if (existingFeedback) {
      return res.status(400).json({ message: 'Feedback already submitted for this registration' });
    }

    // Create new feedback
    const feedback = new Feedback({
      registrationId,
      seminarId,
      rating,
      contentQuality,
      speakerEffectiveness,
      organizationQuality,
      comments,
      suggestions
    });

    const savedFeedback = await feedback.save();

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: savedFeedback
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all feedback for a specific seminar
exports.getSeminarFeedback = async (req, res) => {
  try {
    const { seminarId } = req.params;

    // Verify seminar exists
    const seminar = await Seminar.findById(seminarId);
    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }

    const feedback = await Feedback.find({ seminarId }).populate('registrationId', 'studentName email');

    // Calculate average ratings
    let totalRating = 0;
    let totalContentQuality = 0;
    let totalSpeakerEffectiveness = 0;
    let totalOrganizationQuality = 0;
    
    feedback.forEach(item => {
      totalRating += item.rating;
      totalContentQuality += item.contentQuality;
      totalSpeakerEffectiveness += item.speakerEffectiveness;
      totalOrganizationQuality += item.organizationQuality;
    });

    const count = feedback.length;
    const averageRatings = count > 0 ? {
      overallRating: (totalRating / count).toFixed(1),
      contentQuality: (totalContentQuality / count).toFixed(1),
      speakerEffectiveness: (totalSpeakerEffectiveness / count).toFixed(1),
      organizationQuality: (totalOrganizationQuality / count).toFixed(1)
    } : null;

    res.json({
      feedback,
      averageRatings,
      count
    });
  } catch (error) {
    console.error('Get seminar feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if a user has submitted feedback for a seminar
exports.checkFeedbackStatus = async (req, res) => {
  try {
    const { seminarId, email } = req.params;
    
    // Find the registration for this user and seminar
    const registration = await Registration.findOne({ 
      seminarId, 
      email: String(email).toLowerCase() 
    });
    
    if (!registration) {
      return res.status(200).json({
        isRegistered: false,
        hasFeedback: false
      });
    }
    
    // Check if feedback exists for this registration
    const feedback = await Feedback.findOne({ registrationId: registration._id });
    
    return res.status(200).json({
      isRegistered: true,
      registrationId: registration._id,
      hasFeedback: !!feedback,
      feedbackId: feedback ? feedback._id : null
    });
  } catch (error) {
    console.error('Check feedback status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get feedback by ID
exports.getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    res.json({ feedback });
  } catch (error) {
    console.error('Get feedback by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get feedback statistics for all seminars (admin only)
exports.getFeedbackStats = async (req, res) => {
  try {
    // Aggregate feedback data across all seminars
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: '$seminarId',
          averageRating: { $avg: '$rating' },
          averageContentQuality: { $avg: '$contentQuality' },
          averageSpeakerEffectiveness: { $avg: '$speakerEffectiveness' },
          averageOrganizationQuality: { $avg: '$organizationQuality' },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'seminars',
          localField: '_id',
          foreignField: '_id',
          as: 'seminarDetails'
        }
      },
      {
        $unwind: '$seminarDetails'
      },
      {
        $project: {
          seminarId: '$_id',
          seminarTitle: '$seminarDetails.title',
          averageRating: { $round: ['$averageRating', 1] },
          averageContentQuality: { $round: ['$averageContentQuality', 1] },
          averageSpeakerEffectiveness: { $round: ['$averageSpeakerEffectiveness', 1] },
          averageOrganizationQuality: { $round: ['$averageOrganizationQuality', 1] },
          count: 1
        }
      },
      {
        $sort: { averageRating: -1 }
      }
    ]);

    res.json({ stats });
  } catch (error) {
    console.error('Get feedback stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get feedback submitted by a specific user
exports.getUserFeedback = async (req, res) => {
  try {
    const { email } = req.params;

    // Find registrations by email
    const registrations = await Registration.find({ email });
    const registrationIds = registrations.map(reg => reg._id);

    // Find feedback for these registrations
    const feedback = await Feedback.find({
      registrationId: { $in: registrationIds }
    }).populate({
      path: 'seminarId',
      select: 'title date speaker'
    });

    res.json({ feedback });
  } catch (error) {
    console.error('Get user feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};