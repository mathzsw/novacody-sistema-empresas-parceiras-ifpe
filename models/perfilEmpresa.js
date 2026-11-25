const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

module.exports = sequelize.define('PerfilEmpresa', {
  descricao: DataTypes.TEXT,
  logotipo: DataTypes.STRING(255),
  horario_funcionamento: DataTypes.STRING(160),
  redes_sociais: DataTypes.JSON
}, { tableName: 'perfil_empresa' });
