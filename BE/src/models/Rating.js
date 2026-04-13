const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Appointment = require('./Appointment');

const Rating = sequelize.define('Rating', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  appointmentId: { type: DataTypes.INTEGER, allowNull: false, unique: true }, // Mỗi lịch chỉ đánh giá 1 lần
  doctorId: { type: DataTypes.INTEGER, allowNull: false },
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  score: { type: DataTypes.INTEGER, allowNull: false }, // 1-5
  comment: { type: DataTypes.TEXT, allowNull: true }
}, { timestamps: true });

Rating.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });
Rating.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
Rating.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });

module.exports = Rating;
