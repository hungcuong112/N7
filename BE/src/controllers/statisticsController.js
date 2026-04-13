const { Appointment, User, Rating, Prescription, Service } = require('../models');
const { Op, fn, col } = require('sequelize');

// Bệnh nhân - Dashboard
exports.patientDashboard = async (req, res) => {
  const user = req.userInfo;
  const totalAppointments = await Appointment.count({ where: { patientId: user.id } });
  const completedAppointments = await Appointment.count({ where: { patientId: user.id, status: 'completed' } });
  const upcomingAppointments = await Appointment.count({ where: { patientId: user.id, status: 'pending' } });
  const prescriptionCount = await Prescription.count({ where: { patientId: user.id } });
  const ratingCount = await Rating.count({ where: { patientId: user.id } });

  res.json({
    totalAppointments,
    completedAppointments,
    upcomingAppointments,
    prescriptionCount,
    ratingCount
  });
};

// Bác sĩ - Dashboard
exports.doctorDashboard = async (req, res) => {
  const user = req.userInfo;
  const today = new Date().toISOString().slice(0, 10);

  const totalAppointments = await Appointment.count({ where: { doctorId: user.id } });
  const todayAppointments = await Appointment.count({ where: { doctorId: user.id, date: today } });
  const completedAppointments = await Appointment.count({ where: { doctorId: user.id, status: 'completed' } });
  const prescriptionCount = await Prescription.count({ where: { doctorId: user.id } });
  const ratings = await Rating.findAll({ where: { doctorId: user.id } });
  const avgRating = ratings.length ? (ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length).toFixed(2) : null;

  res.json({
    totalAppointments,
    todayAppointments,
    completedAppointments,
    prescriptionCount,
    avgRating
  });
};

// Admin - Dashboard
exports.adminDashboard = async (req, res) => {
  const totalUsers = await User.count();
  const totalPatients = await User.count({ where: { role: 'patient' } });
  const totalDoctors = await User.count({ where: { role: 'doctor' } });
  const totalAppointments = await Appointment.count();
  const completedAppointments = await Appointment.count({ where: { status: 'completed' } });
  const totalRatings = await Rating.count();

  // Thống kê top chuyên khoa/dịch vụ nếu muốn nâng cao
  // const topSpecialties = await Service.findAll({ ... });

  res.json({
    totalUsers,
    totalPatients,
    totalDoctors,
    totalAppointments,
    completedAppointments,
    totalRatings
    //, topSpecialties
  });
};
