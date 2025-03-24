const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Brand = sequelize.define('Brand', {
  brand_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  brand_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
});

module.exports = Brand;