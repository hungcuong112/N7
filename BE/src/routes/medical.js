const express = require('express');
const router = express.Router();
const medicalController = require('../controllers/medicalController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Tạo/cập nhật bệnh án (bác sĩ)
router.post('/record', authMiddleware, roleMiddleware('doctor'), medicalController.createOrUpdateMedicalRecord);

// Tạo đơn thuốc (bác sĩ)
router.post('/prescription', authMiddleware, roleMiddleware('doctor'), medicalController.createPrescription);

// Lấy chi tiết bệnh án & đơn thuốc (bệnh nhân, bác sĩ)
router.get('/info/:appointmentId', authMiddleware, medicalController.getMedicalRecordAndPrescription);

// Bác sĩ kết thúc khám, nhập bệnh án, đơn thuốc và đổi status lịch khám
router.post('/finish', authMiddleware, roleMiddleware('doctor'), medicalController.finishAppointment);

// Lịch sử chỉnh sửa bệnh án (log)
router.get('/logs/:medicalRecordId', authMiddleware, roleMiddleware(['doctor', 'admin']), medicalController.getMedicalLogs);

// Bệnh nhân lấy lịch sử khám/đơn thuốc
router.get('/history', authMiddleware, roleMiddleware('patient'), medicalController.getPatientHistory);

router.get(
  "/doctor/records",
  authMiddleware,
  roleMiddleware('doctor'),
  medicalController.getMedicalRecordsByDoctor
);

router.put(
  "/prescription/:id",
  authMiddleware,
  roleMiddleware('doctor'),
  medicalController.updatePrescription
);

router.get(
  '/patient/medical-records',
  authMiddleware,
  roleMiddleware('patient'),
  medicalController.getMedicalRecordsOfPatient
);

router.get(
  '/patient/prescriptions',
  authMiddleware,
  roleMiddleware('patient'),
  medicalController.getPrescriptionsOfPatient
);

router.get('/export/:id/pdf', medicalController.exportMedicalRecordPDF);






module.exports = router;
