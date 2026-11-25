const Admin = require('./admin');
const Empresa = require('./empresa');
const PerfilEmpresa = require('./perfilEmpresa');
const Usuario = require('./usuario');
const Categoria = require('./categoria');
const Servico = require('./servico');
const Avaliacao = require('./avaliacao');
const EmpresaCategoria = require('./empresaCategoria');

Empresa.hasOne(PerfilEmpresa, { as: 'perfil', foreignKey: { name: 'empresaId', allowNull: false, unique: true }, onDelete: 'CASCADE' });
PerfilEmpresa.belongsTo(Empresa, { as: 'empresa', foreignKey: 'empresaId' });
Empresa.hasOne(Usuario, { as: 'usuario', foreignKey: { name: 'empresaId', allowNull: false, unique: true }, onDelete: 'CASCADE' });
Usuario.belongsTo(Empresa, { as: 'empresa', foreignKey: 'empresaId' });
Empresa.hasMany(Servico, { as: 'servicos', foreignKey: 'empresaId', onDelete: 'CASCADE' });
Servico.belongsTo(Empresa, { as: 'empresa', foreignKey: 'empresaId' });
Empresa.hasMany(Avaliacao, { as: 'avaliacoes', foreignKey: 'empresaId', onDelete: 'CASCADE' });
Avaliacao.belongsTo(Empresa, { as: 'empresa', foreignKey: 'empresaId' });
Empresa.belongsToMany(Categoria, { as: 'categorias', through: EmpresaCategoria, foreignKey: 'empresaId', otherKey: 'categoriaId' });
Categoria.belongsToMany(Empresa, { as: 'empresas', through: EmpresaCategoria, foreignKey: 'categoriaId', otherKey: 'empresaId' });

module.exports = { Admin, Empresa, PerfilEmpresa, Usuario, Categoria, Servico, Avaliacao, EmpresaCategoria };
