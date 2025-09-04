const Seminar = require('../model/Seminar');
const SeminarArchive = require('../model/SeminarArchive');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/archive/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow common file types
    const allowedTypes = /pdf|doc|docx|ppt|pptx|mp4|mp3|wav|avi|mov|txt|jpg|jpeg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only documents, presentations, videos, audio, and images are allowed'));
    }
  }
});

// Archive a seminar
const archiveSeminar = async (req, res) => {
  try {
    const { seminarId } = req.params;
    const { totalAttendees, averageRating, recordingUrl } = req.body;

    // Get the seminar to archive
    const seminar = await Seminar.findById(seminarId);
    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }

    // Check if already archived
    const existingArchive = await SeminarArchive.findOne({ originalSeminarId: seminarId });
    if (existingArchive) {
      return res.status(400).json({ message: 'Seminar is already archived' });
    }

    // Create archive entry
    const archiveData = {
      originalSeminarId: seminarId,
      title: seminar.title,
      speaker: seminar.speaker,
      topic: seminar.topic,
      description: seminar.description,
      date: seminar.date,
      venue: seminar.venue,
      totalAttendees: totalAttendees || seminar.registeredCount,
      averageRating: averageRating || 0,
      materials: [],
      recordingUrl: recordingUrl || '',
      archivedBy: req.user._id
    };

    const archive = new SeminarArchive(archiveData);
    await archive.save();

    // Mark original seminar as archived
    await Seminar.findByIdAndUpdate(seminarId, { 
      isArchived: true, 
      archivedAt: new Date() 
    });

    res.status(201).json({
      message: 'Seminar archived successfully',
      archive
    });
  } catch (error) {
    console.error('Archive seminar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all archived seminars
const getAllArchivedSeminars = async (req, res) => {
  try {
    const archives = await SeminarArchive.find()
      .populate('archivedBy', 'name email')
      .sort({ archivedAt: -1 });

    res.json({ archives });
  } catch (error) {
    console.error('Get archived seminars error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get archived seminar by ID
const getArchivedSeminarById = async (req, res) => {
  try {
    const archive = await SeminarArchive.findById(req.params.id)
      .populate('archivedBy', 'name email');

    if (!archive) {
      return res.status(404).json({ message: 'Archived seminar not found' });
    }

    res.json({ archive });
  } catch (error) {
    console.error('Get archived seminar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload materials to archived seminar
const uploadMaterials = async (req, res) => {
  try {
    const { archiveId } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const archive = await SeminarArchive.findById(archiveId);
    if (!archive) {
      return res.status(404).json({ message: 'Archived seminar not found' });
    }

    // Add file paths to materials array
    const newMaterials = files.map(file => ({
      filename: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      uploadedAt: new Date()
    }));

    archive.materials.push(...newMaterials);
    await archive.save();

    res.json({
      message: 'Materials uploaded successfully',
      materials: newMaterials
    });
  } catch (error) {
    console.error('Upload materials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Download material
const downloadMaterial = async (req, res) => {
  try {
    const { archiveId, materialIndex } = req.params;
    
    const archive = await SeminarArchive.findById(archiveId);
    if (!archive) {
      return res.status(404).json({ message: 'Archived seminar not found' });
    }

    const material = archive.materials[materialIndex];
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Check if file exists
    if (!fs.existsSync(material.path)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(material.path, material.filename);
  } catch (error) {
    console.error('Download material error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update archived seminar
const updateArchivedSeminar = async (req, res) => {
  try {
    const { id } = req.params;
    const { totalAttendees, averageRating, recordingUrl, materials } = req.body;

    const archive = await SeminarArchive.findByIdAndUpdate(
      id,
      { totalAttendees, averageRating, recordingUrl, materials },
      { new: true }
    );

    if (!archive) {
      return res.status(404).json({ message: 'Archived seminar not found' });
    }

    res.json({
      message: 'Archived seminar updated successfully',
      archive
    });
  } catch (error) {
    console.error('Update archived seminar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete archived seminar
const deleteArchivedSeminar = async (req, res) => {
  try {
    const { id } = req.params;

    const archive = await SeminarArchive.findById(id);
    if (!archive) {
      return res.status(404).json({ message: 'Archived seminar not found' });
    }

    // Delete associated files
    archive.materials.forEach(material => {
      if (fs.existsSync(material.path)) {
        fs.unlinkSync(material.path);
      }
    });

    await SeminarArchive.findByIdAndDelete(id);

    res.json({ message: 'Archived seminar deleted successfully' });
  } catch (error) {
    console.error('Delete archived seminar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get archive statistics
const getArchiveStats = async (req, res) => {
  try {
    const totalArchives = await SeminarArchive.countDocuments();
    const totalMaterials = await SeminarArchive.aggregate([
      { $project: { materialCount: { $size: '$materials' } } },
      { $group: { _id: null, total: { $sum: '$materialCount' } } }
    ]);

    const averageRating = await SeminarArchive.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$averageRating' } } }
    ]);

    const totalAttendees = await SeminarArchive.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAttendees' } } }
    ]);

    res.json({
      totalArchives,
      totalMaterials: totalMaterials[0]?.total || 0,
      averageRating: averageRating[0]?.avgRating || 0,
      totalAttendees: totalAttendees[0]?.total || 0
    });
  } catch (error) {
    console.error('Get archive stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  archiveSeminar,
  getAllArchivedSeminars,
  getArchivedSeminarById,
  uploadMaterials,
  downloadMaterial,
  updateArchivedSeminar,
  deleteArchivedSeminar,
  getArchiveStats,
  upload
};