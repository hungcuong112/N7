const { Doctor, Specialty, User, Appointment, Prescription } = require('../models');
const { Op } = require('sequelize');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.userInfo.id;
    const doctor = await Doctor.findOne({
      where: { userId },
      include: [
        { model: Specialty, as: 'specialty', attributes: ['id', 'name', 'description'] }
      ]
    });
    const user = await User.findByPk(userId);

    if (!doctor || !user) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin bác sĩ' });
    }

    res.json({
      id: doctor.id,
      fullName: doctor.fullName,
      phone: doctor.phone,
      bio: doctor.bio,
      degree: doctor.degree,
      experience: doctor.experience,
      email: user.email,
      specialtyId: doctor.specialtyId,
      specialtyName: doctor.specialty ? doctor.specialty.name : null,
      specialtyDescription: doctor.specialty ? doctor.specialty.description : null
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy profile doctor', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userInfo.id;
    const doctor = await Doctor.findOne({ where: { userId } });
    if (!doctor) return res.status(404).json({ message: 'Không tìm thấy thông tin bác sĩ' });

    const { fullName, phone, degree, experience, bio, specialtyId } = req.body;

    // Chỉ cập nhật khi có dữ liệu hợp lệ (tránh overwrite bằng chuỗi rỗng)
    if (typeof fullName === "string" && fullName.trim() !== "") doctor.fullName = fullName.trim();
    if (typeof phone === "string" && phone.trim() !== "") doctor.phone = phone.trim();
    if (typeof degree === "string" && degree.trim() !== "") doctor.degree = degree.trim();
    if (typeof experience === "string" && experience.trim() !== "") doctor.experience = experience.trim();
    if (typeof bio === "string" && bio.trim() !== "") doctor.bio = bio.trim();
    if (specialtyId) doctor.specialtyId = specialtyId;

    await doctor.save();

    res.json({ message: 'Cập nhật profile thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật profile doctor', error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      attributes: ['id', 'fullName', 'degree'],
      include: [{ model: Specialty, as: 'specialty', attributes: ['name'] }]
    });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách bác sĩ", error: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.userInfo.id;

    // Lấy doctorId từ bảng Doctor theo userId
    const doctor = await Doctor.findOne({ where: { userId } });
    if (!doctor) {
      return res.status(404).json({ message: "Không tìm thấy bác sĩ." });
    }

    const doctorId = doctor.id;
    const today = new Date().toISOString().split("T")[0];

    // Số bệnh nhân hôm nay
    const todayPatients = await Appointment.count({
      where: { doctorId, date: today }
    });

    // Số đơn thuốc đã kê
    const prescriptionsCount = await Prescription.count({
      where: { doctorId }
    });

    // Lịch hẹn sắp tới (sau hôm nay, đã xác nhận)
    const upcomingAppointments = await Appointment.count({
      where: {
        doctorId,
        date: { [Op.gt]: today },
        status: 'confirmed'
      }
    });

    return res.json({
      todayPatients,
      prescriptionsCount,
      upcomingAppointments
    });
  } catch (err) {
    console.error("Lỗi dashboard bác sĩ:", err);
    res.status(500).json({ message: "Lỗi khi lấy thống kê", error: err.message });
  }
};