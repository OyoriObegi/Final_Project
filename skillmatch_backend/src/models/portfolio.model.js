const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Portfolio = sequelize.define('Portfolio', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  projectUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  githubUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isCurrent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  technologies: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  }
});

module.exports = Portfolio; 