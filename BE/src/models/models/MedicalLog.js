const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const MedicalRecord = require('./MedicalRecord');
const User = require('./User');

const MedicalLog = sequelize.define('MedicalLog', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  medicalRecordId: { type: DataTypes.INTEGER, allowNull: false },
  editorId: { type: DataTypes.INTEGER, allowNull: false }, // bác sĩ sửa
  content: { type: DataTypes.TEXT, allowNull: false },
  editedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, { timestamps: false });

MedicalLog.belongsTo(MedicalRecord, { foreignKey: 'medicalRecordId', as: 'medicalRecord' });
MedicalLog.belongsTo(User, { foreignKey: 'editorId', as: 'editor' });

module.exports = MedicalLog;
