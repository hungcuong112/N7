const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Doctor = require('./Doctor');
const Shift = require('./Shift');

const Schedule = sequelize.define('Schedule', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  doctorId: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  shiftId: { type: DataTypes.INTEGER, allowNull: false },
  maxPatients: { type: DataTypes.INTEGER, allowNull: false }
}, { timestamps: true });

// Để tránh lỗi khi require lồng nhau, association nên khai báo ở models/index.js

module.exports = Schedule;
