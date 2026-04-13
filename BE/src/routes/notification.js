const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// CRUD notification cho admin
router.get('/', authMiddleware, roleMiddleware('admin'), notificationController.getAll);
router.post('/', authMiddleware, roleMiddleware('admin'), notificationController.create);
router.put('/:id', authMiddleware, roleMiddleware('admin'), notificationController.update);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), notificationController.delete);

// Đánh dấu đã đọc (cho user - optional)
router.put('/:id/mark-read', authMiddleware, notificationController.markAsRead);

module.exports = router;
