const bcrypt = require('bcrypt');
const { Usuario, Empresa } = require('../models');

async function listarRepresentantes(req, res, next) {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nome', 'email', 'ativo', 'empresaId'],
      include: [{ model: Empresa, as: 'empresa', attributes: ['nome'] }],
      order: [['nome', 'ASC']]
    });
    res.render('usuarios/administradores', { usuarios });
  } catch (erro) { next(erro); }
}

async function carregarFormulario(res, dados = {}) {
  const empresas = await Empresa.findAll({ where: { status_empresa: 'aprovada' }, order: [['nome', 'ASC']] });
  return res.render('usuarios/formulario-admin', { empresas, ...dados });
}

async function formularioCadastro(req, res, next) {
  try { await carregarFormulario(res); } catch (erro) { next(erro); }
}

async function criar(req, res, next) {
  try {
    const empresaId = Number(req.body.empresaId);
    const empresa = await Empresa.findByPk(empresaId);
    const senha = String(req.body.senha || '');
    if (!empresa || senha.length < 8 || !req.body.nome || !req.body.email) {
      return carregarFormulario(res.status(400), { erro: 'Informe os dados, selecione uma empresa aprovada e use uma senha com pelo menos 8 caracteres.' });
    }
    await Usuario.create({
      nome: String(req.body.nome).trim(),
      email: String(req.body.email).trim().toLowerCase(),
      senha: await bcrypt.hash(senha, 12),
      empresaId,
      ativo: true
    });
    res.redirect('/representantes');
  } catch (erro) { next(erro); }
}

async function formularioEdicao(req, res, next) {
  try {
    const usuario = await Usuario.findByPk(req.params.id, { attributes: ['id', 'nome', 'email', 'ativo', 'empresaId'] });
    if (!usuario) return res.status(404).render('erros/404');
    await carregarFormulario(res, { usuario, edicao: true });
  } catch (erro) { next(erro); }
}

async function atualizar(req, res, next) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).render('erros/404');
    const empresa = await Empresa.findByPk(req.body.empresaId);
    if (!empresa || !req.body.nome || !req.body.email) {
      const atual = await Usuario.findByPk(req.params.id, { attributes: ['id', 'nome', 'email', 'ativo', 'empresaId'] });
      return carregarFormulario(res.status(400), { usuario: atual, edicao: true, erro: 'Informe os dados e selecione uma empresa aprovada.' });
    }
    const dados = {
      nome: String(req.body.nome).trim(),
      email: String(req.body.email).trim().toLowerCase(),
      empresaId: empresa.id,
      ativo: req.body.ativo === 'on'
    };
    if (req.body.senha) {
      if (req.body.senha.length < 8) {
        const atual = await Usuario.findByPk(req.params.id, { attributes: ['id', 'nome', 'email', 'ativo', 'empresaId'] });
        return carregarFormulario(res.status(400), { usuario: atual, edicao: true, erro: 'A senha precisa ter pelo menos 8 caracteres.' });
      }
      dados.senha = await bcrypt.hash(req.body.senha, 12);
    }
    await usuario.update(dados);
    res.redirect('/representantes');
  } catch (erro) { next(erro); }
}

async function excluir(req, res, next) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).render('erros/404');
    await usuario.destroy();
    res.redirect('/representantes');
  } catch (erro) { next(erro); }
}

module.exports = { listarRepresentantes, formularioCadastro, criar, formularioEdicao, atualizar, excluir };
