const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

module.exports = sequelize.define('Admin', {
  nome: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(160), allowNull: false, unique: true, validate: { isEmail: true } },
  senha: { type: DataTypes.STRING(255), allowNull: false },
  tipo: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'admin' }
}, { tableName: 'admin', timestamps: false });
