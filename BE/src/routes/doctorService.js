const express = require('express');
const router = express.Router();
const doctorServiceController = require('../controllers/doctorServiceController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Lấy tất cả liên kết
router.get('/', doctorServiceController.getAll);

// Tạo mới liên kết (chỉ admin)
router.post('/', authMiddleware, roleMiddleware('admin'), doctorServiceController.create);

// Xóa liên kết (chỉ admin)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), doctorServiceController.delete);

module.exports = router;
