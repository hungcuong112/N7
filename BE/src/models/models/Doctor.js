const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Specialty = require('./Specialty');

const Doctor = sequelize.define('Doctor', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  specialtyId: { type: DataTypes.INTEGER, allowNull: false },
  fullName: { type: DataTypes.STRING, allowNull: false },
  degree: { type: DataTypes.STRING },
  experience: { type: DataTypes.STRING },
  bio: { type: DataTypes.TEXT },
  phone: { type: DataTypes.STRING }
}, { timestamps: true });
module.exports = Doctor;
