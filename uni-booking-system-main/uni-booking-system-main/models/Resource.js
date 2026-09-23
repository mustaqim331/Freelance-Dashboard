const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Resource = sequelize.define('Resource', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false // e.g., "Computer Lab 3", "DSLR Camera Kit A"
  },
  category: {
    type: DataTypes.ENUM('FACILITY', 'EQUIPMENT', 'VEHICLE'),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING // e.g., "Block B, Level 2"
  },
  capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  requiresApproval: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Resource;