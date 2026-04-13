const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Lấy tất cả dịch vụ (ai cũng xem được)
router.get('/', serviceController.getAll);

// Thêm mới dịch vụ (chỉ admin)
router.post('/', authMiddleware, roleMiddleware('admin'), serviceController.create);

// Sửa dịch vụ (chỉ admin)
router.put('/:id', authMiddleware, roleMiddleware('admin'), serviceController.update);

// Xóa dịch vụ (chỉ admin)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), serviceController.delete);

module.exports = router;
