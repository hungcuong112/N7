const { User, Appointment, Rating } = require('../models');
const { Op } = require('sequelize');

exports.getStatistics = async (req, res) => {
  try {
    // Tổng số bệnh nhân, bác sĩ
    const totalPatients = await User.count({ where: { role: 'patient' } });
    const totalDoctors = await User.count({ where: { role: 'doctor' } });

    // Tổng số lịch khám
    const totalAppointments = await Appointment.count();

    // Tổng số đánh giá
    const totalRatings = await Rating.count();

    // Điểm trung bình toàn hệ thống
    const avgRatingData = await Rating.findAll({ attributes: ['score'] });
    const avgScore = avgRatingData.length
      ? (avgRatingData.reduce((sum, r) => sum + r.score, 0) / avgRatingData.length).toFixed(2)
      : null;

    // Tổng doanh thu (nếu có trường fee trên Appointment)
    const totalRevenue = await Appointment.sum('fee') || 0;

    // Có thể thống kê thêm: top bác sĩ, top điểm, tổng bệnh nhân theo tháng,...

    res.json([
      { id: 1, title: "Tổng số bệnh nhân", value: totalPatients },
      { id: 2, title: "Tổng số bác sĩ", value: totalDoctors },
      { id: 3, title: "Tổng số lịch khám", value: totalAppointments },
      { id: 4, title: "Tổng số đánh giá", value: totalRatings },
      { id: 5, title: "Điểm trung bình đánh giá", value: avgScore },
      { id: 6, title: "Tổng doanh thu", value: totalRevenue }
    ]);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi thống kê báo cáo', error: err.message });
  }
};
