const { Patient } = require('../models'); // Đảm bảo import đúng

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userInfo.id; // id của user đăng nhập (User.id)

    // Tìm record Patient theo userId
    const patient = await Patient.findOne({ where: { userId } });
    if (!patient) {
      return res.status(404).json({ message: 'Không tìm thấy bệnh nhân' });
    }

    const { fullName, phone, gender, dob, address } = req.body;
    patient.fullName = fullName || patient.fullName;
    patient.phone = phone || patient.phone;
    patient.gender = gender || patient.gender;
    patient.dob = dob || patient.dob;
    patient.address = address || patient.address;

    await patient.save();

    res.json({
      message: 'Cập nhật profile thành công',
      patient: {
        id: patient.id,
        fullName: patient.fullName,
        phone: patient.phone,
        gender: patient.gender,
        dob: patient.dob,
        address: patient.address,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật profile', error: err.message });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const userId = req.userInfo.id;
    const patient = await Patient.findOne({ where: { userId } });
    if (!patient) {
      return res.status(404).json({ message: 'Không tìm thấy bệnh nhân' });
    }
    res.json({
      id: patient.id,
      fullName: patient.fullName,
      phone: patient.phone,
      gender: patient.gender,
      dob: patient.dob,
      address: patient.address,
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy profile patient', error: err.message });
  }
};
