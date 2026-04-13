const { Payment, Appointment } = require('../models');

// Bệnh nhân xác nhận đã chuyển khoản (gửi link ảnh biên lai)
exports.confirmBankTransfer = async (req, res) => {
  try {
    const user = req.userInfo;
    const { appointmentId, bankReceiptImage } = req.body;
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment || appointment.patientId !== user.id)
      return res.status(400).json({ message: 'Không tìm thấy lịch khám hoặc không có quyền!' });

    let payment = await Payment.findOne({ where: { appointmentId } });
    if (!payment) {
      payment = await Payment.create({
        appointmentId,
        patientId: user.id,
        method: 'bank',
        status: 'pending',
        bankReceiptImage
      });
    } else {
      payment.bankReceiptImage = bankReceiptImage;
      payment.status = 'pending';
      await payment.save();
    }

    res.json({ message: 'Đã xác nhận chuyển khoản, chờ admin kiểm tra!', payment });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xác nhận thanh toán', error: err.message });
  }
};

// Admin duyệt/thay đổi trạng thái thanh toán
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body; // 'success' hoặc 'failed'
    const payment = await Payment.findByPk(paymentId);
    if (!payment) return res.status(404).json({ message: 'Không tìm thấy payment' });

    payment.status = status;
    await payment.save();
    res.json({ message: 'Cập nhật trạng thái thanh toán thành công!', payment });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật trạng thái', error: err.message });
  }
};

// Bệnh nhân xem lịch sử thanh toán
exports.getMyPayments = async (req, res) => {
  try {
    const user = req.userInfo;
    const payments = await Payment.findAll({
      where: { patientId: user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy lịch sử thanh toán', error: err.message });
  }
};

// Admin xem danh sách tất cả payment (dashboard)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({ order: [['createdAt', 'DESC']] });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách thanh toán', error: err.message });
  }
};

// (Tùy chọn) Admin xem chi tiết payment
exports.getPaymentDetail = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findByPk(paymentId);
    if (!payment) return res.status(404).json({ message: 'Không tìm thấy payment' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy payment', error: err.message });
  }
};
