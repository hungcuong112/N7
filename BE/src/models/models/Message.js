const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Appointment = require('./Appointment');

const Message = sequelize.define('Message', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  appointmentId: { type: DataTypes.INTEGER, allowNull: false },
  senderId: { type: DataTypes.INTEGER, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  sentAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { timestamps: false });

Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });

module.exports = Message;
