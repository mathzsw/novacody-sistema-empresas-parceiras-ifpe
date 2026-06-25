const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');


const Empresa = sequelize.define(
  'Empresa',
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cnpj: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    telefone: {
      type: DataTypes.STRING
    },
    contato: {
      type: DataTypes.STRING
    },
    endereco: {
      type: DataTypes.STRING
    },
    tipo_parceria: {
      type: DataTypes.STRING
    },
    website: {
      type: DataTypes.STRING
    },
    quantidade_vagas: {
      type: DataTypes.INTEGER
    },
    descricao_vagas: {
      type: DataTypes.TEXT
    },
    aceita_estagiario: {
      type: DataTypes.BOOLEAN
    },
    observacoes: {
      type: DataTypes.TEXT
    },
    status_empresa: {
      type: DataTypes.STRING,
      defaultValue: 'pendente'
    }
  },
  {
    tableName: 'empresa',
    timestamps: false
  }
);


module.exports = Empresa;
