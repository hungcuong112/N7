const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Shift = sequelize.define('Shift', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false }, // Tên ca: "Ca sáng 1"
  startTime: { type: DataTypes.TIME, allowNull: false }, // "08:00"
  endTime: { type: DataTypes.TIME, allowNull: false },   // "10:00"
  note: { type: DataTypes.STRING, allowNull: true }
}, { timestamps: false });

module.exports = Shift;
