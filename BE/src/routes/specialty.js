const express = require('express');
const router = express.Router();
const specialtyController = require('../controllers/specialtyController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Lấy tất cả chuyên khoa (ai cũng xem được)
router.get('/', specialtyController.getAll);

// Thêm mới chuyên khoa (chỉ admin)
router.post('/', authMiddleware, roleMiddleware('admin'), specialtyController.create);

// Sửa chuyên khoa (chỉ admin)
router.put('/:id', authMiddleware, roleMiddleware('admin'), specialtyController.update);

// Xóa chuyên khoa (chỉ admin)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), specialtyController.delete);

module.exports = router;
