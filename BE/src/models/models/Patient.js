const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Patient = sequelize.define('Patient', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    unique: true 
  },
  fullName: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING(150), 
    allowNull: false 
  },
  dod: { 
    type: DataTypes.DATEONLY, 
    allowNull: true 
  },
  gender: { 
    type: DataTypes.STRING(10), 
    allowNull: true 
  },
  phone: { 
    type: DataTypes.STRING(20), 
    allowNull: true 
  },
  address: { 
    type: DataTypes.STRING(255), 
    allowNull: true 
  }
}, { 
  timestamps: true 
});

module.exports = Patient;
