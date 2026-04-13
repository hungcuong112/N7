const { MedicalRecord, Prescription, PrescriptionItem, Appointment, User, MedicalLog, Doctor, Patient, Shift } = require('../models');
const { Op } = require('sequelize');
const PDFDocument = require("pdfkit");


// Tạo/cập nhật bệnh án cho 1 lịch khám
exports.createOrUpdateMedicalRecord = async (req, res) => {
  try {
    const { appointmentId, symptoms, diagnosis, notes } = req.body;
    let record = await MedicalRecord.findOne({ where: { appointmentId } });
    if (record) {
      record.symptoms = symptoms;
      record.diagnosis = diagnosis;
      record.notes = notes;
      await record.save();
    } else {
      record = await MedicalRecord.create({ appointmentId, symptoms, diagnosis, notes });
    }
    res.json({ message: 'Lưu bệnh án thành công', record });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lưu bệnh án', error: err.message });
  }
};

// Tạo đơn thuốc cho 1 lịch khám
exports.createPrescription = async (req, res) => {
  try {
    const { appointmentId, notes, items } = req.body; // items: mảng [{medicineName, dosage, quantity, instruction}]
    // Check đã có đơn thuốc chưa
    let prescription = await Prescription.findOne({ where: { appointmentId } });
    if (prescription) return res.status(400).json({ message: 'Đơn thuốc đã tồn tại' });

    // Lấy thông tin lịch khám
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) return res.status(404).json({ message: 'Không tìm thấy lịch khám' });

    // Tạo đơn thuốc
    prescription = await Prescription.create({
      appointmentId,
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      notes
    });
    // Tạo các thuốc trong đơn
    for (const item of items) {
      await PrescriptionItem.create({
        prescriptionId: prescription.id,
        ...item
      });
    }
    res.status(201).json({ message: 'Tạo đơn thuốc thành công', prescriptionId: prescription.id });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo đơn thuốc', error: err.message });
  }
};

// Lấy chi tiết bệnh án & đơn thuốc theo appointmentId
exports.getMedicalRecordAndPrescription = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const record = await MedicalRecord.findOne({ where: { appointmentId } });
    const prescription = await Prescription.findOne({
      where: { appointmentId },
      include: [{ model: PrescriptionItem, as: 'prescriptionItems' }]
    });
    res.json({ record, prescription });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy chi tiết bệnh án & đơn thuốc', error: err.message });
  }
};

// Bác sĩ hoàn tất lịch khám, nhập bệnh án, đơn thuốc, đổi status
exports.finishAppointment = async (req, res) => {
  try {
    const { appointmentId, symptoms, diagnosis, notes, prescriptionNotes, items } = req.body;
    const doctor = req.userInfo;

    // 1. Kiểm tra quyền
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment || appointment.doctorId !== doctor.id)
      return res.status(404).json({ message: 'Không tìm thấy lịch khám hoặc không có quyền.' });

    // 2. Cập nhật/nhập bệnh án
    let record = await MedicalRecord.findOne({ where: { appointmentId } });
    let oldContent = '';
    if (record) {
      oldContent = `Trước sửa: triệu chứng: ${record.symptoms}, chẩn đoán: ${record.diagnosis}, ghi chú: ${record.notes}`;
      record.symptoms = symptoms;
      record.diagnosis = diagnosis;
      record.notes = notes;
      await record.save();
    } else {
      record = await MedicalRecord.create({ appointmentId, symptoms, diagnosis, notes });
    }

    // 3. Ghi log chỉnh sửa bệnh án
    await MedicalLog.create({
      medicalRecordId: record.id,
      editorId: doctor.id,
      content: oldContent ? `Sửa bệnh án. ${oldContent}` : 'Tạo mới bệnh án.',
      editedAt: new Date()
    });

    // 4. Tạo đơn thuốc (nếu chưa có)
    let prescription = await Prescription.findOne({ where: { appointmentId } });
    if (!prescription && items && items.length) {
      prescription = await Prescription.create({
        appointmentId,
        doctorId: doctor.id,
        patientId: appointment.patientId,
        notes: prescriptionNotes
      });
      for (const item of items) {
        await PrescriptionItem.create({
          prescriptionId: prescription.id,
          ...item
        });
      }
    }

    // 5. Đánh dấu lịch đã hoàn tất
    appointment.status = 'completed';
    await appointment.save();

    res.json({ message: 'Khám và nhập bệnh án/đơn thuốc thành công!', record, prescription });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi hoàn tất lịch khám', error: err.message });
  }
};

// Lịch sử chỉnh sửa bệnh án (log)
exports.getMedicalLogs = async (req, res) => {
  try {
    const { medicalRecordId } = req.params;
    const logs = await MedicalLog.findAll({
      where: { medicalRecordId },
      include: [{ model: User, as: 'editor', attributes: ['id', 'fullName'] }]
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy log bệnh án', error: err.message });
  }
};

// Bệnh nhân lấy lịch sử khám & đơn thuốc
exports.getPatientHistory = async (req, res) => {
  try {
    const user = req.userInfo;
    const appointments = await Appointment.findAll({
      where: { patientId: user.id, status: 'completed' },
      include: [
        { model: User, as: 'doctor', attributes: ['id', 'fullName'] }
      ],
      order: [['date', 'DESC'], ['time', 'DESC']]
    });
    const data = [];
    for (let appt of appointments) {
      const record = await MedicalRecord.findOne({ where: { appointmentId: appt.id } });
      const prescription = await Prescription.findOne({
        where: { appointmentId: appt.id },
        include: [{ model: PrescriptionItem, as: 'prescriptionItems' }]
      });
      data.push({ appointment: appt, record, prescription });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy lịch sử khám', error: err.message });
  }
};


exports.getMedicalRecordsByDoctor = async (req, res) => {
  try {
    const userId = req.user.id;

    const doctor = await Doctor.findOne({ where: { userId } });
    if (!doctor) return res.status(404).json({ message: 'Không tìm thấy bác sĩ' });

    const records = await MedicalRecord.findAll({
      include: [
        {
          model: Appointment,
          as: 'appointment',
          where: { doctorId: doctor.id },
          include: [
            { model: User, as: 'patient', attributes: ['id', 'fullName', 'email'] },
            { model: Shift, as: 'shift', attributes: ['id', 'name'] }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(records);
  } catch (err) {
    console.error("Lỗi getMedicalRecordsByDoctor:", err);
    res.status(500).json({ message: "Lỗi lấy bệnh án", error: err.message });
  }
};

// Cập nhật đơn thuốc và danh sách thuốc
exports.updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, items } = req.body; // items: [{id?, medicineName, dosage, quantity, instruction}]
    const prescription = await Prescription.findByPk(id);
    if (!prescription) return res.status(404).json({ message: 'Không tìm thấy đơn thuốc' });

    // Cập nhật notes
    prescription.notes = notes;
    await prescription.save();

    // Lấy danh sách thuốc cũ
    const oldItems = await PrescriptionItem.findAll({ where: { prescriptionId: id } });

    // Cập nhật hoặc thêm mới thuốc
    for (const item of items) {
      if (item.id) {
        // Update thuốc cũ
        const old = oldItems.find(i => i.id === item.id);
        if (old) {
          old.medicineName = item.medicineName;
          old.dosage = item.dosage;
          old.quantity = item.quantity;
          old.instruction = item.instruction;
          await old.save();
        }
      } else {
        // Thêm thuốc mới
        await PrescriptionItem.create({
          prescriptionId: id,
          medicineName: item.medicineName,
          dosage: item.dosage,
          quantity: item.quantity,
          instruction: item.instruction
        });
      }
    }
    // Xóa thuốc bị remove khỏi danh sách
    const keepIds = items.filter(i => i.id).map(i => i.id);
    for (const old of oldItems) {
      if (!keepIds.includes(old.id)) {
        await old.destroy();
      }
    }

    res.json({ message: "Cập nhật đơn thuốc thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật đơn thuốc", error: err.message });
  }
};

exports.getMedicalRecordsOfPatient = async (req, res) => {
  try {
    const user = req.userInfo || req.user; // Đảm bảo lấy đúng user
    // Lấy tất cả record theo patientId (user.id) và status 'done'/'completed'
    const appointments = await Appointment.findAll({
  where: {
    patientId: user.id,
    status: { [Op.in]: ["done", "completed"] }
  },
  order: [["date", "DESC"], ["shiftId", "DESC"]]
});


    const records = await Promise.all(
      appointments.map(async (appt) => {
        const record = await MedicalRecord.findOne({ where: { appointmentId: appt.id } });
        const prescription = await Prescription.findOne({
          where: { appointmentId: appt.id },
          include: [{ model: PrescriptionItem, as: 'prescriptionItems' }]
        });
        return {
          appointment: appt,
          record,
          prescription,
        };
      })
    );

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy hồ sơ bệnh án bệnh nhân", error: err.message });
  }
};

exports.getPrescriptionsOfPatient = async (req, res) => {
  try {
    const user = req.userInfo || req.user;
    // Lấy toàn bộ đơn thuốc của bệnh nhân, kèm lịch hẹn và bác sĩ
    const prescriptions = await Prescription.findAll({
      where: { patientId: user.id },
      include: [
        {
          model: Appointment,
          as: 'appointment',
          attributes: ['date'],
          include: [
            // Bác sĩ trong bảng Appointment là Doctor
            {
              model: require('../models').Doctor,
              as: 'doctor',
              attributes: ['id'],
              include: [
                // Lấy thông tin user của bác sĩ
                {
                  model: require('../models').User,
                  as: 'user',
                  attributes: ['fullName']
                }
              ]
            }
          ]
        },
        {
          model: PrescriptionItem,
          as: 'prescriptionItems'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Chuyển đổi dữ liệu cho dễ dùng trên FE
    const result = prescriptions.map(presc => ({
      id: presc.id,
      date: presc.appointment?.date,
      doctorName: presc.appointment?.doctor?.user?.fullName || "",
      notes: presc.notes,
      items: presc.prescriptionItems
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy đơn thuốc của bệnh nhân", error: err.message });
  }
};

// Xuất PDF bệnh án theo medicalRecordId
exports.exportMedicalRecordPDF = async (req, res) => {
  try {
    const { id } = req.params; // medicalRecordId

    // Lấy medical record + appointment + bệnh nhân + shift + đơn thuốc
    const record = await MedicalRecord.findByPk(id, {
      include: [
        {
          model: Appointment,
          as: "appointment",
          attributes: ["date"],
          include: [
            { model: User, as: "patient", attributes: ["fullName", "email", "id"] },
            { model: Shift, as: "shift", attributes: ["name"] }
          ]
        }
      ]
    });

    if (!record) return res.status(404).json({ message: "Không tìm thấy bệnh án" });

    // Lấy prescription (nếu có)
    const prescription = await Prescription.findOne({
      where: { appointmentId: record.appointmentId },
      include: [{ model: PrescriptionItem, as: "prescriptionItems" }]
    });

    // Tạo PDF
    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=medical_record_${id}.pdf`);
    doc.pipe(res);

    // Header
    doc.fontSize(18).text("HỒ SƠ BỆNH ÁN", { align: "center" });
    doc.moveDown(0.5);

    // Thông tin khám bệnh
    doc.fontSize(12);
    doc.text(`Bệnh nhân: ${record.appointment?.patient?.fullName || "--"}`);
    doc.text(`Email: ${record.appointment?.patient?.email || "--"}`);
    doc.text(`Ngày khám: ${record.appointment?.date ? new Date(record.appointment.date).toLocaleDateString() : "--"}`);
    doc.text(`Ca khám: ${record.appointment?.shift?.name || "--"}`);
    doc.moveDown();

    // Thông tin bệnh án
    doc.text(`Triệu chứng: ${record.symptoms || "--"}`);
    doc.text(`Chẩn đoán: ${record.diagnosis || "--"}`);
    doc.text(`Ghi chú: ${record.notes || "--"}`);
    doc.moveDown();

    // Đơn thuốc
    if (prescription) {
      doc.fontSize(14).text("ĐƠN THUỐC", { align: "left" });
      doc.fontSize(12).moveDown(0.3);
      doc.text(`Lời dặn: ${prescription.notes || "--"}`);
      doc.moveDown(0.2);

      // Table header
      doc.font("Helvetica-Bold").text("Tên thuốc", 50, doc.y, { continued: true })
        .text("Liều dùng", 200, doc.y, { continued: true })
        .text("Số lượng", 300, doc.y, { continued: true })
        .text("Cách dùng", 370, doc.y);
      doc.moveDown(0.2);
      doc.font("Helvetica");

      prescription.prescriptionItems.forEach(item => {
        doc.text(item.medicineName, 50, doc.y, { continued: true })
          .text(item.dosage, 200, doc.y, { continued: true })
          .text(item.quantity.toString(), 300, doc.y, { continued: true })
          .text(item.instruction || "", 370, doc.y);
        doc.moveDown(0.1);
      });
    } else {
      doc.text("Chưa có đơn thuốc.");
    }

    doc.end();
  } catch (err) {
    res.status(500).json({ message: "Lỗi xuất PDF bệnh án", error: err.message });
  }
};
