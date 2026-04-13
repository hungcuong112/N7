// Lấy thông tin profile của user đang đăng nhập
exports.getProfile = async (req, res) => {
  try {
    const user = req.userInfo;
    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (err) {
    res.status(500).json({ message: 'Lấy profile thất bại', error: err.message });
  }
};

// Đã bỏ uploadAvatar và updateProfile, chỉ còn 1 endpoint duy nhất như trên!
