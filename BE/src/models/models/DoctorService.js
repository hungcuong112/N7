const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Service = require('./Service');

const DoctorService = sequelize.define('DoctorService', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  doctorId: { type: DataTypes.INTEGER, allowNull: false },
  serviceId: { type: DataTypes.INTEGER, allowNull: false }
}, { timestamps: false });

DoctorService.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });
DoctorService.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });

module.exports = DoctorService;
