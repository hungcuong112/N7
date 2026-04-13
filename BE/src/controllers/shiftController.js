const { Shift } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const shifts = await Shift.findAll({ order: [['id', 'ASC']] });
    res.json(shifts);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy ca", error: err.message });
  }
};
