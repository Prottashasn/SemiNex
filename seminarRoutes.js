// backend/routes/seminarRoutes.js
const express = require('express');
const router = express.Router();
const Seminar = require('../model/Seminar');
const {protect} = require('../middleware/auth');

// Create a new seminar (Admin only)
router.post('/', protect, async (req, res) => {
  try {
    const seminar = new Seminar({
      ...req.body,
      createdBy: req.user._id
    });
    
    await seminar.save();
    res.status(201).json({ message: 'Seminar created successfully', seminar });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all seminars
router.get('/', async (req, res) => {
  try {
    const seminars = await Seminar.find().populate('createdBy', 'email name');
    res.json(seminars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single seminar
router.get('/:id', async (req, res) => {
  try {
    const seminar = await Seminar.findById(req.params.id).populate('createdBy', 'email name');
    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }
    res.json(seminar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get seminar capacity status
router.get('/:id/capacity', async (req, res) => {
  try {
    const seminar = await Seminar.findById(req.params.id);
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
    res.status(500).json({ message: error.message });
  }
});

// Update seminar (Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const seminar = await Seminar.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }
    res.json({ message: 'Seminar updated successfully', seminar });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete seminar (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const seminar = await Seminar.findByIdAndDelete(req.params.id);
    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }
    res.json({ message: 'Seminar deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;