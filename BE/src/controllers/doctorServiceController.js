const { DoctorService, User, Service } = require('../models');

// Lấy tất cả liên kết bác sĩ – dịch vụ
exports.getAll = async (req, res) => {
  try {
    const items = await DoctorService.findAll({
      include: [
        { model: User, as: 'doctor', attributes: ['id', 'fullName'] },
        { model: Service, as: 'service', attributes: ['id', 'name'] }
      ]
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy liên kết bác sĩ – dịch vụ', error: err.message });
  }
};

// Thêm mới liên kết (admin)
exports.create = async (req, res) => {
  try {
    const { doctorId, serviceId } = req.body;
    // Kiểm tra trùng
    const existed = await DoctorService.findOne({ where: { doctorId, serviceId } });
    if (existed) return res.status(400).json({ message: 'Đã tồn tại liên kết này' });
    const ds = await DoctorService.create({ doctorId, serviceId });
    res.status(201).json({ message: 'Tạo liên kết thành công', item: ds });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo liên kết', error: err.message });
  }
};

// Xóa liên kết
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const ds = await DoctorService.findByPk(id);
    if (!ds) return res.status(404).json({ message: 'Không tìm thấy liên kết' });
    await ds.destroy();
    res.json({ message: 'Đã xóa liên kết' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xóa liên kết', error: err.message });
  }
};
