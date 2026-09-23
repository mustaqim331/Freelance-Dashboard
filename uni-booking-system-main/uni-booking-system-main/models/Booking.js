const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Resource = require('./Resource');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'),
    defaultValue: 'APPROVED'
  },
  purpose: {
    type: DataTypes.TEXT
  }
});

// Relationships
Booking.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
Booking.belongsTo(Resource, { foreignKey: 'resourceId', onDelete: 'CASCADE' });

User.hasMany(Booking, { foreignKey: 'userId' });
Resource.hasMany(Booking, { foreignKey: 'resourceId' });

module.exports = Booking;