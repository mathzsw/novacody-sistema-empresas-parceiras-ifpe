const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Admin = sequelize.define('Admin', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'admin',
    timestamps: false
});

module.exports = Admin;