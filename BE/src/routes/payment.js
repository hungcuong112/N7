const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Upload ảnh biên lai
router.post('/upload-receipt', authMiddleware, roleMiddleware('patient'), upload.single('receipt'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Chưa gửi file' });
  const url = `/uploads/receipts/${req.file.filename}`;
  res.json({ url });
});

// Bệnh nhân xác nhận đã chuyển khoản (gửi link ảnh biên lai)
router.post('/bank-transfer', authMiddleware, roleMiddleware('patient'), paymentController.confirmBankTransfer);

// Bệnh nhân xem lịch sử
router.get('/my', authMiddleware, roleMiddleware('patient'), paymentController.getMyPayments);

// Admin duyệt trạng thái thanh toán (success/failed)
router.put('/:paymentId/status', authMiddleware, roleMiddleware('admin'), paymentController.updatePaymentStatus);

// Admin xem tất cả payment (dashboard)
router.get('/all', authMiddleware, roleMiddleware('admin'), paymentController.getAllPayments);

// (Tùy chọn) Admin xem chi tiết payment
router.get('/:paymentId', authMiddleware, roleMiddleware('admin'), paymentController.getPaymentDetail);

module.exports = router;
