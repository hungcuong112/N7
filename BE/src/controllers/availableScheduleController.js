const { Doctor, Schedule, Shift, Appointment } = require('../models');
const { Op } = require('sequelize');

// GET /api/available-schedules?specialtyId=1&date=2024-07-01
exports.getAvailableSchedules = async (req, res) => {
  try {
    const { specialtyId, date } = req.query;
    if (!specialtyId || !date) {
      return res.status(400).json({ message: 'Thiếu chuyên khoa hoặc ngày' });
    }

    // Lấy danh sách bác sĩ chuyên khoa đó
    const doctors = await Doctor.findAll({
      where: { specialtyId },
      attributes: ['id', 'fullName'] // Nếu có rating, nếu không có thì bỏ đi
    });

    // Lấy danh sách ca (shift) trong hệ thống
    const shifts = await Shift.findAll();

    // Lấy tất cả schedule của các bác sĩ này trong ngày đã chọn
    const doctorIds = doctors.map(d => d.id);
    const schedules = await Schedule.findAll({
      where: { doctorId: doctorIds, date },
      attributes: ['id', 'doctorId', 'shiftId', 'maxPatients'],
    });

    // Đếm số lượng appointments từng schedule
    const scheduleIds = schedules.map(sch => sch.id);
    const appointments = await Appointment.findAll({
      where: { scheduleId: scheduleIds, date },
      attributes: ['scheduleId'],
    });

    // Đếm số booked cho từng schedule
    const apptCount = {};
    appointments.forEach(a => {
      apptCount[a.scheduleId] = (apptCount[a.scheduleId] || 0) + 1;
    });

    // Map từng bác sĩ → từng ca (shift) → trạng thái slot
    const result = doctors.map(doc => {
      const shiftList = shifts.map(shift => {
        // Tìm schedule của bác sĩ này, ca này, ngày này
        const sch = schedules.find(s =>
          s.doctorId === doc.id && s.shiftId === shift.id
        );
        let currentBooked = 0, maxPatients = 0, available = false, scheduleId = null;
        if (sch) {
          scheduleId = sch.id; 
          currentBooked = apptCount[sch.id] || 0;
          maxPatients = sch.maxPatients;
          available = currentBooked < maxPatients;
        }
        return {
          shiftId: shift.id,
          shiftName: shift.name,
          startTime: shift.startTime,
          endTime: shift.endTime,
          scheduleId,
          maxPatients,
          currentBooked,
          available
        };
      });
      return {
        doctorId: doc.id,
        doctorName: doc.fullName,
       // rating: doc.rating || null, // nếu có
        shifts: shiftList
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy lịch trống", error: err.message });
  }
};
