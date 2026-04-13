const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');

// Gửi tin nhắn
router.post('/', authMiddleware, messageController.sendMessage);

// Lấy toàn bộ tin nhắn của một lịch khám
router.get('/:appointmentId', authMiddleware, messageController.getMessagesByAppointment);

module.exports = router;
