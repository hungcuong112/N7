const { Service } = require('../models');

// Lấy tất cả dịch vụ
exports.getAll = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách dịch vụ', error: err.message });
  }
};

// Thêm mới dịch vụ (chỉ admin)
exports.create = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const existed = await Service.findOne({ where: { name } });
    if (existed) return res.status(400).json({ message: 'Tên dịch vụ đã tồn tại' });
    const service = await Service.create({ name, description, price });
    res.status(201).json({ message: 'Tạo dịch vụ thành công', service });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo dịch vụ', error: err.message });
  }
};

// Sửa dịch vụ (chỉ admin)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const service = await Service.findByPk(id);
    if (!service) return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
    service.name = name || service.name;
    service.description = description || service.description;
    service.price = price || service.price;
    await service.save();
    res.json({ message: 'Cập nhật dịch vụ thành công', service });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật dịch vụ', error: err.message });
  }
};

// Xóa dịch vụ (chỉ admin)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
    await service.destroy();
    res.json({ message: 'Đã xóa dịch vụ' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xóa dịch vụ', error: err.message });
  }
};
