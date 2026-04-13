const { Rating, Appointment, User, Patient } = require('../models');

// Bệnh nhân gửi đánh giá cho bác sĩ sau khi khám xong

exports.createRating = async (req, res) => {
  try {
    const user = req.userInfo;
    const { appointmentId, score, comment } = req.body;

    if (!appointmentId || !score) {
      return res.status(400).json({ message: "Thiếu dữ liệu đầu vào." });
    }

    const patient = await Patient.findOne({ where: { userId: user.id } });
    if (!patient) {
      return res.status(400).json({ message: 'Không tìm thấy hồ sơ bệnh nhân.' });
    }

    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(400).json({ message: 'Lịch khám không tồn tại.' });
    }

    // ✅ So sánh bằng user.id vì dữ liệu đang dùng userId làm patientId
    if (appointment.patientId !== user.id) {
      return res.status(400).json({ message: 'Lịch khám không thuộc người dùng này.' });
    }

    if (!['done', 'completed'].includes(appointment.status)) {
      return res.status(400).json({ message: 'Lịch khám chưa hoàn tất, không thể đánh giá.' });
    }

    const existed = await Rating.findOne({ where: { appointmentId } });
    if (existed) {
      return res.status(400).json({ message: 'Bạn đã đánh giá lịch khám này rồi.' });
    }

    const rating = await Rating.create({
      appointmentId,
      doctorId: appointment.doctorId,
      patientId: patient.id,
      score,
      comment
    });

    return res.status(201).json({ message: 'Đánh giá thành công!', rating });

  } catch (err) {
    console.error("💥 Lỗi createRating:", err);
    res.status(500).json({ message: 'Lỗi tạo đánh giá', error: err.message });
  }
};


// Lấy danh sách đánh giá của bác sĩ (bệnh nhân, bác sĩ, admin đều xem được)
exports.getDoctorRatings = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const ratings = await Rating.findAll({
      where: { doctorId },
      include: [{ model: User, as: 'patient', attributes: ['id', 'fullName'] }],
      order: [['createdAt', 'DESC']]
    });
    // Tính điểm trung bình
    const avg = ratings.length ? (ratings.reduce((s, r) => s + r.score, 0) / ratings.length).toFixed(2) : null;
    res.json({ average: avg, total: ratings.length, ratings });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy đánh giá bác sĩ', error: err.message });
  }
};

// (Admin hoặc bác sĩ có thể xem thống kê tất cả đánh giá, bạn có thể bổ sung thêm API này)
