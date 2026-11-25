const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

module.exports = sequelize.define('EmpresaCategoria', {
  empresaId: { type: DataTypes.INTEGER, primaryKey: true, references: { model: 'empresa', key: 'id' } },
  categoriaId: { type: DataTypes.INTEGER, primaryKey: true, references: { model: 'categoria', key: 'id' } }
}, { tableName: 'empresa_categoria', timestamps: false });
