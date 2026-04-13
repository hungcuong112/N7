const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Doctor = require('./Doctor');
const Shift = require('./Shift');
const User = require('./User');
const Schedule = require('./Schedule');
const Service = require('./Service');

const Appointment = sequelize.define('Appointment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  doctorId: { type: DataTypes.INTEGER, allowNull: false },
  scheduleId: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  shiftId: { type: DataTypes.INTEGER, allowNull: false },
  serviceIds: { type: DataTypes.JSON, allowNull: true },
  note: { type: DataTypes.STRING, allowNull: true },
  status: { type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'done'), defaultValue: 'pending' }
}, { timestamps: true });

Appointment.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });
Appointment.belongsTo(Schedule, { foreignKey: 'scheduleId', as: 'schedule' });
Appointment.belongsTo(Shift, { foreignKey: 'shiftId', as: 'shift' });
Appointment.belongsTo(User, { foreignKey: 'doctorId', as: 'doctorUser' });


module.exports = Appointment;
