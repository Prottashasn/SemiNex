const express = require('express');
const router = express.Router(); // ← This line is essential!
const speakerController = require('../controllers/speakerController');
const { protect } = require('../middleware/auth');

// Speaker routes
router.post('/', protect, speakerController.createSpeaker);
router.get('/', speakerController.getAllSpeakers);
router.get('/:id', speakerController.getSpeakerById);
router.put('/:id', protect, speakerController.updateSpeaker);
router.delete('/:id', protect, speakerController.deleteSpeaker);

module.exports = router; // ← Must export router directly!  
  