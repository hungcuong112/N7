const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Appointment = require('./Appointment');

const MedicalRecord = sequelize.define('MedicalRecord', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  appointmentId: { type: DataTypes.INTEGER, allowNull: false, unique: true }, // Mỗi lịch khám chỉ 1 bệnh án
  symptoms: { type: DataTypes.TEXT, allowNull: true },
  diagnosis: { type: DataTypes.TEXT, allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true }
}, { timestamps: true });

MedicalRecord.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });


module.exports = MedicalRecord;
