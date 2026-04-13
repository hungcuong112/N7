const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Lấy profile (yêu cầu đăng nhập)
router.get('/me', authMiddleware, userController.getProfile);

// KHÔNG còn updateProfile và uploadAvatar ở đây nữa
// Nếu có API đổi password hoặc email, bạn tạo file controller riêng

module.exports = router;
