const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Color = sequelize.define('Color', {
  color_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  color_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
});

module.exports = Color;