import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; 

const Product = sequelize.define('Product', {
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  brand_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  color_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  emmi_number: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING(1000), 
    allowNull: true, 
  },
});

export default Product; 