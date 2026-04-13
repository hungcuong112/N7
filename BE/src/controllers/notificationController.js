const { NotificationLog, User } = require('../models');

// Lấy tất cả thông báo (admin: broadcast + cá nhân)
exports.getAll = async (req, res) => {
  try {
    const notis = await NotificationLog.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'fullName', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(notis);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách thông báo', error: err.message });
  }
};

// Tạo mới thông báo (broadcast hoặc cá nhân)
// Nếu userId=null hoặc không gửi thì là broadcast, nếu gửi userId thì là cá nhân
exports.create = async (req, res) => {
  try {
    const { userId, type, title, content } = req.body;
    const noti = await NotificationLog.create({
      userId: userId || null,
      type: type || 'general',
      title,
      content,
      isRead: false
    });
    res.status(201).json({ message: "Đã tạo thông báo", noti });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo thông báo', error: err.message });
  }
};

// Sửa thông báo
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type } = req.body;
    const noti = await NotificationLog.findByPk(id);
    if (!noti) return res.status(404).json({ message: "Không tìm thấy thông báo" });
    noti.title = title ?? noti.title;
    noti.content = content ?? noti.content;
    noti.type = type ?? noti.type;
    await noti.save();
    res.json({ message: "Đã sửa thông báo", noti });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi sửa thông báo', error: err.message });
  }
};

// Xóa thông báo
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const noti = await NotificationLog.findByPk(id);
    if (!noti) return res.status(404).json({ message: "Không tìm thấy thông báo" });
    await noti.destroy();
    res.json({ message: "Đã xóa thông báo" });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xóa thông báo', error: err.message });
  }
};

// Đánh dấu đã đọc (cho user)
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const noti = await NotificationLog.findByPk(id);
    if (!noti) return res.status(404).json({ message: "Không tìm thấy thông báo" });
    noti.isRead = true;
    await noti.save();
    res.json({ message: "Đã đánh dấu đã đọc" });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi', error: err.message });
  }
};
