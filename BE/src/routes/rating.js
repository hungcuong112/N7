const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Bệnh nhân gửi đánh giá
router.post('/', authMiddleware, roleMiddleware('patient'), ratingController.createRating);

// Xem đánh giá của bác sĩ (ai cũng xem được)
router.get('/doctor/:doctorId', ratingController.getDoctorRatings);

module.exports = router;
