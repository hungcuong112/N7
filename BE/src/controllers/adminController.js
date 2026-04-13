const { User, Doctor, Specialty, Appointment, Patient } = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

// Lấy danh sách bác sĩ kèm chuyên khoa
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.findAll({
      where: { role: 'doctor' },
      attributes: ['id', 'email', 'isActive'],
      include: [
        {
          model: Doctor, as: 'profile',
          attributes: ['fullName', 'degree', 'experience', 'bio', 'specialtyId'],
          include: [
            { model: Specialty, as: 'specialty', attributes: ['id', 'name'] }
          ]
        }
      ]
    });
    const data = doctors.map(d => ({
      id: d.id,
      fullName: d.profile?.fullName || "",
      email: d.email,
      degree: d.profile?.degree || "",
      experience: d.profile?.experience || "",
      bio: d.profile?.bio || "",
      specialtyId: d.profile?.specialtyId || null,
      specialtyName: d.profile?.specialty?.name || "",
      isActive: d.isActive
    }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách bác sĩ', error: err.message });
  }
};



// Tạo bác sĩ mới
exports.createDoctor = async (req, res) => {
  try {
    const { fullName, email, password, specialtyId, degree, experience, bio } = req.body;
    const existed = await User.findOne({ where: { email } });
    if (existed) return res.status(400).json({ message: 'Email đã tồn tại' });

    const hashedPass = await bcrypt.hash(password, 10);
    const userDoctor = await User.create({
  email, password: hashedPass, role: 'doctor'
});


    // Tạo profile Doctor kèm chuyên khoa
    await Doctor.create({
  userId: userDoctor.id,
  fullName,
  specialtyId,
  degree,
  experience,
  bio,
});


    res.status(201).json({ message: 'Tạo bác sĩ thành công', doctorId: userDoctor.id });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo bác sĩ', error: err.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, password, specialtyId, degree, experience, bio } = req.body;
    const user = await User.findOne({ where: { id, role: 'doctor' } });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy bác sĩ' });

    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();

    // Update profile Doctor
    const profile = await Doctor.findOne({ where: { userId: id } });
    if (profile) {
      if (fullName) profile.fullName = fullName;
      if (specialtyId) profile.specialtyId = specialtyId;
      if (degree !== undefined) profile.degree = degree;
      if (experience !== undefined) profile.experience = experience;
      if (bio !== undefined) profile.bio = bio;
      await profile.save();
    }
    res.json({ message: "Cập nhật bác sĩ thành công!" });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật bác sĩ', error: err.message });
  }
};


exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await User.findOne({ where: { id, role: 'doctor' } });
    if (!doctor) return res.status(404).json({ message: 'Không tìm thấy bác sĩ' });
    doctor.isActive = false;
    await doctor.save();
    res.json({ message: 'Đã vô hiệu hóa bác sĩ' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xóa bác sĩ', error: err.message });
  }
};

exports.toggleDoctorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await User.findOne({ where: { id, role: 'doctor' } });
    if (!doctor) return res.status(404).json({ message: 'Không tìm thấy bác sĩ' });
    doctor.isActive = !doctor.isActive;
    await doctor.save();
    res.json({ message: `Tài khoản đã ${doctor.isActive ? 'kích hoạt' : 'vô hiệu hóa'}!`, isActive: doctor.isActive });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi thay đổi trạng thái', error: err.message });
  }
};

// Dashboard tổng hợp số liệu
exports.getDashboardStats = async (req, res) => {
  try {
    const totalPatients = await User.count({ where: { role: 'patient' } });
    const totalDoctors = await User.count({ where: { role: 'doctor' } });

    // Đếm lịch hẹn hôm nay
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const totalAppointmentsToday = await Appointment.count({
      where: {
        date: {
          [Op.gte]: today.toISOString().slice(0, 10),
          [Op.lt]: tomorrow.toISOString().slice(0, 10)
        }
      }
    });

    res.json({
      totalPatients,
      totalDoctors,
      totalAppointmentsToday
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy dashboard stats", error: err.message });
  }
};

// Lấy danh sách bệnh nhân (lấy từ bảng Patient, join User để lấy trạng thái tài khoản)
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'isActive']
      }]
    });
    const data = patients.map(p => ({
      id: p.id,
      fullName: p.fullName,
      email: p.email,           // Email trên hồ sơ bệnh nhân
      phone: p.phoneNumber,     // Số điện thoại trên hồ sơ bệnh nhân
      isActive: p.user?.isActive ?? false
    }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách bệnh nhân', error: err.message });
  }
};

// Đổi trạng thái hoạt động (active/inactive) – cập nhật trên bảng User
exports.togglePatientStatus = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id, {
      include: [{ model: User, as: 'user' }]
    });
    if (!patient || !patient.user) return res.status(404).json({ message: 'Không tìm thấy bệnh nhân' });
    patient.user.isActive = !patient.user.isActive;
    await patient.user.save();
    res.json({ message: `Tài khoản đã ${patient.user.isActive ? 'kích hoạt' : 'vô hiệu hóa'}!`, isActive: patient.user.isActive });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi thay đổi trạng thái', error: err.message });
  }
};

// Sửa thông tin hồ sơ bệnh nhân (sửa bảng Patient)
exports.updatePatient = async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;
    const patient = await Patient.findByPk(req.params.id, {
      include: [{ model: User, as: 'user' }]
    });
    if (!patient) return res.status(404).json({ message: 'Không tìm thấy bệnh nhân' });

    patient.fullName = fullName || patient.fullName;
    patient.email = email || patient.email;
    patient.phoneNumber = phone || patient.phoneNumber;
    await patient.save();

    // Nếu muốn cho sửa luôn email đăng nhập, bỏ comment dòng sau (chỉ nên cho sửa nếu có xác thực lại)
    // if (email) { patient.user.email = email; await patient.user.save(); }

    res.json({ message: "Cập nhật thông tin bệnh nhân thành công!" });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật bệnh nhân', error: err.message });
  }
};


