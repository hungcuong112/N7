const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Lấy thông tin bác sĩ
router.get('/me', authMiddleware, roleMiddleware('doctor'), doctorController.getProfile);
router.put('/me', authMiddleware, roleMiddleware('doctor'), doctorController.updateProfile);
// Lấy danh sách tất cả bác sĩ (cho admin/FE)
router.get('/', doctorController.getAll);

// Bác sĩ xem lịch khám cá nhân
//router.get('/appointments', authMiddleware, roleMiddleware('doctor'), doctorController.getMyAppointments);

router.get('/me/dashboard', authMiddleware, roleMiddleware('doctor'), doctorController.getDashboardStats);

module.exports = router;
