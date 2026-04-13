const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Dashboard cho bệnh nhân
router.get('/patient', authMiddleware, roleMiddleware('patient'), statisticsController.patientDashboard);

// Dashboard cho bác sĩ
router.get('/doctor', authMiddleware, roleMiddleware('doctor'), statisticsController.doctorDashboard);

// Dashboard cho admin
router.get('/admin', authMiddleware, roleMiddleware('admin'), statisticsController.adminDashboard);

module.exports = router;
