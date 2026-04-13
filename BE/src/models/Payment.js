const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Appointment = require('./Appointment');
const User = require('./User');

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  appointmentId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  method: { type: DataTypes.STRING, allowNull: false, defaultValue: 'bank' }, // chỉ cần 'bank'
  status: { type: DataTypes.ENUM('pending', 'success', 'failed'), defaultValue: 'pending' },
  bankReceiptImage: { type: DataTypes.STRING, allowNull: true }, // link ảnh biên lai (nếu có)
  note: { type: DataTypes.STRING, allowNull: true }
}, { timestamps: true });

Payment.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });
Payment.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });

module.exports = Payment;
