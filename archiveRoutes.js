const express = require('express');
const router = express.Router();
const archiveController = require('../controllers/archiveController');
const { protect, adminOnly } = require('../middleware/auth');

// Get all archived seminars
router.get('/', archiveController.getAllArchivedSeminars);

// Get archive statistics
router.get('/stats', archiveController.getArchiveStats);

// Get archived seminar by ID
router.get('/:id', archiveController.getArchivedSeminarById);

// Archive a seminar (Admin only)
router.post('/archive/:seminarId', protect, adminOnly, archiveController.archiveSeminar);

// Upload materials to archived seminar (Admin only)
router.post('/:archiveId/materials', 
  protect, 
  adminOnly, 
  archiveController.upload.array('materials', 10), 
  archiveController.uploadMaterials
);

// Download material
router.get('/:archiveId/materials/:materialIndex/download', archiveController.downloadMaterial);

// Update archived seminar (Admin only)
router.put('/:id', protect, adminOnly, archiveController.updateArchivedSeminar);

// Delete archived seminar (Admin only)
router.delete('/:id', protect, adminOnly, archiveController.deleteArchivedSeminar);

module.exports = router;