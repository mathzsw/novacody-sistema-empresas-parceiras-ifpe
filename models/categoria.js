const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

module.exports = sequelize.define('Categoria', {
  nome: { type: DataTypes.STRING(80), allowNull: false, unique: true },
  descricao: DataTypes.TEXT
}, { tableName: 'categoria' });
