const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const ratingController = require('../controllers/ratingController');
const { Rating, User } = require('../models');



// Lấy thông tin hồ sơ bệnh nhân đang đăng nhập (chỉ cho patient)
router.get('/me', authMiddleware, roleMiddleware('patient'), patientController.getProfile);

// Update profile (patient)
router.put('/me', authMiddleware, roleMiddleware('patient'), patientController.updateProfile);

router.get('/:id/ratings', authMiddleware, roleMiddleware('patient'), async (req, res) => {
  const { id } = req.params;
  try {
    const ratings = await require('../models').Rating.findAll({
      where: { patientId: id },
      include: [
        {
          model: require('../models').User,
          as: 'doctor',
          attributes: ['fullName']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const result = ratings.map(r => ({
      id: r.id,
      doctorName: r.doctor?.fullName || "Không rõ",
      score: r.score,
      comment: r.comment
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy đánh giá', error: err.message });
  }
});

module.exports = router;
