const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Appointment = require('./Appointment');
const PrescriptionItem = require('./PrescriptionItem');

const Prescription = sequelize.define('Prescription', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  appointmentId: { type: DataTypes.INTEGER, allowNull: false, unique: true }, // 1 lịch khám chỉ 1 đơn thuốc
  doctorId: { type: DataTypes.INTEGER, allowNull: false },
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  notes: { type: DataTypes.TEXT, allowNull: true }
}, { timestamps: true });

Prescription.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });
Prescription.hasMany(PrescriptionItem, { foreignKey: 'prescriptionId', as: 'prescriptionItems' });
PrescriptionItem.belongsTo(Prescription, { foreignKey: 'prescriptionId', as: 'prescription' });

module.exports = Prescription;
