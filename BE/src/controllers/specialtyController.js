const { Specialty, Doctor } = require('../models');
const { Sequelize } = require('sequelize');
// Lấy danh sách chuyên khoa
exports.getAll = async (req, res) => {
  try {
    const specialties = await Specialty.findAll({
      attributes: [
        'id',
        'name',
        'description',
        [Sequelize.fn('COUNT', Sequelize.col('doctors.id')), 'doctorCount']
      ],
      include: [
        {
          model: Doctor,
          as: 'doctors',
          attributes: [],
        }
      ],
      group: ['Specialty.id'],
      order: [['id', 'ASC']]
    });
    res.json(specialties);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách chuyên khoa', error: err.message });
  }
};

// Thêm mới chuyên khoa
exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;
    // Kiểm tra trùng tên
    const existed = await Specialty.findOne({ where: { name } });
    if (existed) return res.status(400).json({ message: 'Tên chuyên khoa đã tồn tại' });

    const specialty = await Specialty.create({ name, description });
    res.status(201).json({ message: 'Tạo chuyên khoa thành công', specialty });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo chuyên khoa', error: err.message });
  }
};

// Sửa chuyên khoa
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const specialty = await Specialty.findByPk(id);
    if (!specialty) return res.status(404).json({ message: 'Không tìm thấy chuyên khoa' });

    specialty.name = name || specialty.name;
    specialty.description = description || specialty.description;
    await specialty.save();

    res.json({ message: 'Cập nhật chuyên khoa thành công', specialty });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật chuyên khoa', error: err.message });
  }
};

// Xóa chuyên khoa
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const specialty = await Specialty.findByPk(id);
    if (!specialty) return res.status(404).json({ message: 'Không tìm thấy chuyên khoa' });

    await specialty.destroy();
    res.json({ message: 'Đã xóa chuyên khoa' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xóa chuyên khoa', error: err.message });
  }
};

