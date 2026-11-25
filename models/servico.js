const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

module.exports = sequelize.define('Servico', {
  nome: { type: DataTypes.STRING(120), allowNull: false },
  descricao: DataTypes.TEXT,
  ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, { tableName: 'servico' });
