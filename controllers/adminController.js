const bcrypt = require('bcrypt');
const { Admin } = require('../models');

async function listar(req, res, next) {
  try {
    const administradores = await Admin.findAll({ attributes: ['id', 'nome', 'email', 'tipo'], order: [['nome', 'ASC']] });
    res.render('administradores/index', { administradores });
  } catch (erro) { next(erro); }
}

function formularioCadastro(req, res) { res.render('administradores/cadastrar'); }

async function criar(req, res, next) {
  try {
    const nome = String(req.body.nome || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const senha = String(req.body.senha || '');
    if (!nome || !email || senha.length < 8) {
      return res.status(400).render('administradores/cadastrar', { erro: 'Informe os campos e use uma senha com pelo menos 8 caracteres.' });
    }
    await Admin.create({ nome, email, senha: await bcrypt.hash(senha, 12), tipo: req.body.tipo || 'admin' });
    res.redirect('/usuarios');
  } catch (erro) { next(erro); }
}

async function formularioEdicao(req, res, next) {
  try {
    const administrador = await Admin.findByPk(req.params.id, { attributes: ['id', 'nome', 'email', 'tipo'] });
    if (!administrador) return res.status(404).render('erros/404');
    res.render('administradores/editar', { administrador });
  } catch (erro) { next(erro); }
}

async function atualizar(req, res, next) {
  try {
    const administrador = await Admin.findByPk(req.params.id);
    if (!administrador) return res.status(404).render('erros/404');
    const dados = {
      nome: String(req.body.nome || '').trim(),
      email: String(req.body.email || '').trim().toLowerCase(),
      tipo: req.body.tipo || 'admin'
    };
    if (req.body.senha) {
      if (req.body.senha.length < 8) {
        return res.status(400).render('administradores/editar', {
          administrador: { ...administrador.toJSON(), senha: undefined },
          erro: 'A senha precisa ter pelo menos 8 caracteres.'
        });
      }
      dados.senha = await bcrypt.hash(req.body.senha, 12);
    }
    await administrador.update(dados);
    res.redirect('/usuarios');
  } catch (erro) { next(erro); }
}

async function excluir(req, res, next) {
  try {
    if (Number(req.params.id) === req.session.usuario.id) {
      return res.redirect('/usuarios?mensagem=Você+não+pode+excluir+sua+própria+conta');
    }
    const administrador = await Admin.findByPk(req.params.id);
    if (!administrador) return res.status(404).render('erros/404');
    await administrador.destroy();
    res.redirect('/usuarios');
  } catch (erro) { next(erro); }
}

module.exports = { listar, formularioCadastro, criar, formularioEdicao, atualizar, excluir };
