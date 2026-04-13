const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/', appointmentController.createAppointment);
router.get('/mine', appointmentController.getMyAppointments);
router.patch('/:id/cancel', appointmentController.cancelAppointment);
router.patch('/:id/reschedule', appointmentController.rescheduleAppointment);
router.patch('/:id/status', appointmentController.updateAppointmentStatus);
router.get('/doctor/:doctorId', appointmentController.getDoctorAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.post('/:id/complete', appointmentController.completeAppointment);
router.get(
  '/completed-for-rating',
  authMiddleware,
  roleMiddleware('patient'),
  appointmentController.getCompletedAppointmentsForRating
);


module.exports = router;
