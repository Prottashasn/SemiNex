const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

// Admin routes - protected and admin only
router.get('/', protect, adminOnly, userController.getAllUsers);
router.get('/stats', protect, adminOnly, userController.getUserStats);
router.get('/role/:role', protect, adminOnly, userController.getUsersByRole);
router.get('/:id', protect, adminOnly, userController.getUserById);
router.put('/:id/block', protect, adminOnly, userController.blockUser);
router.put('/:id/unblock', protect, adminOnly, userController.unblockUser);
router.put('/:id/warning', protect, adminOnly, userController.addWarning);
router.delete('/:id', protect, adminOnly, userController.deleteUser);

module.exports = router;          