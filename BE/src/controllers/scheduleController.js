const { Schedule, Doctor, Shift } = require('../models');

// Lấy toàn bộ lịch làm việc
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.findAll({
      include: [
        { model: Doctor, as: 'doctor', attributes: ['id', 'fullName'] },
        { model: Shift, as: 'shift' }
      ]
    });
    const data = schedules.map(sch => ({
      id: sch.id,
      doctorId: sch.doctorId,
      doctorName: sch.doctor ? sch.doctor.fullName : "",
      date: sch.date,
      shiftId: sch.shiftId,
      shiftName: sch.shift ? sch.shift.name : "",
      maxPatients: sch.maxPatients
    }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy lịch làm việc", error: err.message });
  }
};

// Thêm mới lịch làm việc
exports.createSchedule = async (req, res) => {
  try {
    const { doctorId, date, shiftId, maxPatients } = req.body;
    if (!doctorId || !date || !shiftId || !maxPatients) {
      return res.status(400).json({ message: "Thiếu dữ liệu!" });
    }
    // Kiểm tra trùng ca
    const exists = await Schedule.findOne({ where: { doctorId, date, shiftId } });
    if (exists) return res.status(409).json({ message: "Bác sĩ đã có ca này!" });
    const schedule = await Schedule.create({ doctorId, date, shiftId, maxPatients });
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo lịch làm việc", error: err.message });
  }
};

// Sửa lịch làm việc
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctorId, date, shiftId, maxPatients } = req.body;
    const schedule = await Schedule.findByPk(id);
    if (!schedule) return res.status(404).json({ message: "Không tìm thấy lịch" });
    // Kiểm tra trùng ca (trừ chính nó)
    const exists = await Schedule.findOne({
      where: { doctorId, date, shiftId, id: { [require('sequelize').Op.ne]: id } }
    });
    if (exists) return res.status(409).json({ message: "Bác sĩ đã có ca này!" });
    await schedule.update({ doctorId, date, shiftId, maxPatients });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: "Lỗi sửa lịch", error: err.message });
  }
};

// Xóa lịch làm việc
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findByPk(id);
    if (!schedule) return res.status(404).json({ message: "Không tìm thấy lịch" });
    await schedule.destroy();
    res.json({ message: "Đã xóa lịch!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xóa lịch", error: err.message });
  }
};

// Lấy lịch làm việc của 1 bác sĩ
exports.getDoctorSchedules = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const schedules = await Schedule.findAll({
      where: { doctorId },
      include: [{ model: Shift, as: 'shift' }],
      order: [['date', 'ASC'], ['shiftId', 'ASC']]
    });
    const data = schedules.map(sch => ({
      id: sch.id,
      date: sch.date,
      shiftName: sch.shift ? sch.shift.name : "",
      maxPatients: sch.maxPatients
    }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy lịch bác sĩ", error: err.message });
  }
};
