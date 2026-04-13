const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Prescription = require('./Prescription');

const PrescriptionItem = sequelize.define('PrescriptionItem', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  prescriptionId: { type: DataTypes.INTEGER, allowNull: false },
  medicineName: { type: DataTypes.STRING, allowNull: false },
  dosage: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  instruction: { type: DataTypes.STRING, allowNull: true }
}, { timestamps: false });

PrescriptionItem.belongsTo(Prescription, { foreignKey: 'prescriptionId', as: 'prescription' });

module.exports = PrescriptionItem;
