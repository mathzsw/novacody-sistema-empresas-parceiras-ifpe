const bcrypt = require('bcrypt');
const { Admin, Usuario } = require('../models');

async function autenticar(conta, senha) {
  if (!conta) return false;
  const senhaSalva = conta.senha || '';
  if (/^\$2[aby]\$/.test(senhaSalva)) return bcrypt.compare(senha, senhaSalva);
  if (senhaSalva && senhaSalva === senha) {
    conta.senha = await bcrypt.hash(senha, 12);
    await conta.save();
    return true;
  }
  return false;
}

async function loginAdmin(req, res, next) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const admin = await Admin.findOne({ where: { email } });
    if (!await autenticar(admin, String(req.body.senha || ''))) {
      return res.status(401).render('administradores/login', { erro: 'E-mail ou senha inválidos.' });
    }
    req.session.regenerate((erro) => {
      if (erro) return next(erro);
      req.session.usuario = { id: admin.id, nome: admin.nome, email: admin.email, papel: 'admin', tipo: admin.tipo };
      req.session.save((falha) => falha ? next(falha) : res.redirect('/area-admin'));
    });
  } catch (erro) { next(erro); }
}

async function loginRepresentante(req, res, next) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const usuario = await Usuario.findOne({ where: { email, ativo: true } });
    if (!await autenticar(usuario, String(req.body.senha || ''))) {
      return res.status(401).render('usuarios/login', { erro: 'E-mail ou senha inválidos.' });
    }
    req.session.regenerate((erro) => {
      if (erro) return next(erro);
      req.session.usuario = { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: 'representante', empresaId: usuario.empresaId };
      req.session.save((falha) => falha ? next(falha) : res.redirect('/minha-empresa'));
    });
  } catch (erro) { next(erro); }
}

function logout(req, res, next) {
  req.session.destroy((erro) => {
    if (erro) return next(erro);
    res.clearCookie('novacody.sid');
    res.redirect('/');
  });
}

module.exports = { loginAdmin, loginRepresentante, logout };
