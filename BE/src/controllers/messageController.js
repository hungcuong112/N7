const { Message, Appointment, User, Doctor } = require('../models');

// Gửi tin nhắn cho một lịch khám (cả bác sĩ và bệnh nhân đều gọi được)
exports.sendMessage = async (req, res) => {
  try {
    const user = req.userInfo;
    const { appointmentId, content } = req.body;

    // Lấy thông tin lịch + bác sĩ để kiểm tra đúng quyền
    const appointment = await Appointment.findByPk(appointmentId, {
      include: [{ model: Doctor, as: 'doctor' }]
    });

    if (
      !appointment ||
      (
        appointment.patientId !== user.id &&
        appointment.doctor?.userId !== user.id // so sánh đúng ID của bác sĩ
      )
    ) {
      return res.status(403).json({ message: 'Không có quyền gửi tin nhắn cho lịch này!' });
    }

    const message = await Message.create({
      appointmentId,
      senderId: user.id,
      content,
      sentAt: new Date()
    });

    res.status(201).json({ message: 'Gửi tin nhắn thành công!', data: message });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi gửi tin nhắn', error: err.message });
  }
};

// Lấy toàn bộ tin nhắn theo appointment
exports.getMessagesByAppointment = async (req, res) => {
  try {
    const user = req.userInfo;
    const { appointmentId } = req.params;

    const appointment = await Appointment.findByPk(appointmentId, {
      include: [{ model: Doctor, as: 'doctor' }]
    });

    if (
      !appointment ||
      (
        appointment.patientId !== user.id &&
        appointment.doctor?.userId !== user.id
      )
    ) {
      return res.status(403).json({ message: 'Không có quyền xem tin nhắn lịch này!' });
    }

    const messages = await Message.findAll({
      where: { appointmentId },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'fullName', 'role']
        }
      ],
      order: [['sentAt', 'ASC']]
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy tin nhắn', error: err.message });
  }
};

