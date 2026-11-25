const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

module.exports = sequelize.define('Empresa', {
  nome: { type: DataTypes.STRING(160), allowNull: false },
  cnpj: { type: DataTypes.STRING(18), unique: true },
  email: { type: DataTypes.STRING(160), validate: { isEmail: true } },
  telefone: DataTypes.STRING(30),
  contato: DataTypes.STRING(120),
  endereco: DataTypes.STRING(255),
  tipo_parceria: DataTypes.STRING(80),
  website: DataTypes.STRING(255),
  quantidade_vagas: { type: DataTypes.INTEGER, validate: { min: 0 } },
  descricao_vagas: DataTypes.TEXT,
  aceita_estagiario: { type: DataTypes.BOOLEAN, defaultValue: false },
  observacoes: DataTypes.TEXT,
  status_empresa: {
    type: DataTypes.ENUM('pendente', 'aprovada', 'rejeitada'),
    allowNull: false,
    defaultValue: 'pendente'
  }
}, { tableName: 'empresa', timestamps: false });
