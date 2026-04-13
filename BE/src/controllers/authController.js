// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Patient } = require('../models');

// Đăng ký
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    // Kiểm tra email tồn tại
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email đã được sử dụng' });
    }
    // Mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Tạo user mới
    const user = await User.create({
      email,
      password: hashedPassword,
      role: role || 'patient',
      fullName,
    });

    // Nếu là patient thì tạo hồ sơ Patient
    let patientProfile = null;
    if ((role || 'patient') === 'patient') {
      patientProfile = await Patient.create({
        userId: user.id,
        fullName,
        email
      });
    }

    res.status(201).json({
      message: 'Đăng ký thành công',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        patientProfile
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Đăng ký thất bại', error: err.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Tìm user
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

    // So sánh password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

    // Sinh JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Nếu là patient thì trả về luôn profile patient
    let patientProfile = null;
    if (user.role === 'patient') {
      patientProfile = await Patient.findOne({ where: { userId: user.id } });
    }

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        patientProfile
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Đăng nhập thất bại', error: err.message });
  }
};
