const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Bác sĩ
router.get('/doctors', authMiddleware, roleMiddleware('admin'), adminController.getAllDoctors);
router.post('/doctors', authMiddleware, roleMiddleware('admin'), adminController.createDoctor);
router.delete('/doctors/:id', authMiddleware, roleMiddleware('admin'), adminController.deleteDoctor);
router.put('/doctors/:id', authMiddleware, roleMiddleware('admin'), adminController.updateDoctor);
router.patch('/doctors/:id/toggle-status', authMiddleware, roleMiddleware('admin'), adminController.toggleDoctorStatus);
router.get('/dashboard-stats', authMiddleware, roleMiddleware('admin'), adminController.getDashboardStats);
//router.get('/patients', authMiddleware, roleMiddleware('admin'), adminController.getAllPatients);
// Quản lý bệnh nhân
router.get('/patients', authMiddleware, roleMiddleware('admin'), adminController.getAllPatients);
// Vô hiệu hóa/kích hoạt lại tài khoản bệnh nhân
router.patch('/patients/:id/toggle-status', authMiddleware, roleMiddleware('admin'), adminController.togglePatientStatus);
// Sửa thông tin bệnh nhân
router.put('/patients/:id', authMiddleware, roleMiddleware('admin'), adminController.updatePatient);


module.exports = router;
