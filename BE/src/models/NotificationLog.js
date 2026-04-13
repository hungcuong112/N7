const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const NotificationLog = sequelize.define('NotificationLog', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: true }, // null = gửi broadcast
  type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'general' }, // general, reminder, canceled,...
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: true });

NotificationLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = NotificationLog;
