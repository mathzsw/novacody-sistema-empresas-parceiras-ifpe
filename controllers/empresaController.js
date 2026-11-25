const { Op } = require('sequelize');
const { Empresa } = require('../models');

async function listarPublicas(req, res, next) {
  try {
    const busca = String(req.query.busca || '').trim();
    const tipo = String(req.query.tipo || '').trim();
    const where = { status_empresa: 'aprovada' };
    if (busca) {
      where[Op.or] = ['nome', 'cnpj', 'email', 'contato'].map((campo) => ({
        [campo]: { [Op.like]: '%' + busca + '%' }
      }));
    }
    if (tipo) where.tipo_parceria = tipo;
    const empresas = await Empresa.findAll({ where, order: [['nome', 'ASC']] });
    res.render('index', { empresas, busca, tipo });
  } catch (erro) { next(erro); }
}

function formularioCadastro(req, res) { res.render('cadastroempresa'); }

async function solicitarCadastro(req, res, next) {
  try {
    await Empresa.create({ ...dadosEmpresa(req.body), status_empresa: 'pendente' });
    res.render('cadastroconcluido');
  } catch (erro) { next(erro); }
}

async function listarAdmin(req, res, next) {
  try {
    const pendentes = await Empresa.findAll({ where: { status_empresa: 'pendente' }, order: [['nome', 'ASC']] });
    res.render('area-admin/pendentes', { pendentes });
  } catch (erro) { next(erro); }
}

async function listarAprovadas(req, res, next) {
  try {
    const aprovadas = await Empresa.findAll({ where: { status_empresa: 'aprovada' }, order: [['nome', 'ASC']] });
    res.render('area-admin/aprovadas', { aprovadas });
  } catch (erro) { next(erro); }
}

function formularioAdmin(req, res) { res.render('cadastroempresaadmin'); }

async function criarPeloAdmin(req, res, next) {
  try {
    await Empresa.create({ ...dadosEmpresa(req.body), status_empresa: 'aprovada' });
    res.redirect('/area-admin/aprovadas');
  } catch (erro) { next(erro); }
}

async function formularioEdicao(req, res, next) {
  try {
    const empresa = await Empresa.findByPk(req.params.id);
    if (!empresa) return res.status(404).render('erros/404');
    res.render('editarempresa', { empresa });
  } catch (erro) { next(erro); }
}

async function atualizar(req, res, next) {
  try {
    const empresa = await Empresa.findByPk(req.params.id);
    if (!empresa) return res.status(404).render('erros/404');
    await empresa.update(dadosEmpresa(req.body));
    res.redirect(empresa.status_empresa === 'pendente' ? '/area-admin/pendentes' : '/area-admin/aprovadas');
  } catch (erro) { next(erro); }
}

async function aprovar(req, res, next) {
  try {
    const empresa = await Empresa.findByPk(req.params.id);
    if (!empresa) return res.status(404).render('erros/404');
    await empresa.update({ status_empresa: 'aprovada' });
    res.redirect('/area-admin/pendentes');
  } catch (erro) { next(erro); }
}

async function excluir(req, res, next) {
  try {
    const empresa = await Empresa.findByPk(req.params.id);
    if (!empresa) return res.status(404).render('erros/404');
    const destino = empresa.status_empresa === 'pendente' ? '/area-admin/pendentes' : '/area-admin/aprovadas';
    await empresa.destroy();
    res.redirect(destino);
  } catch (erro) { next(erro); }
}

function dadosEmpresa(body) {
  return {
    nome: String(body.nome || '').trim(),
    cnpj: String(body.cnpj || '').trim() || null,
    email: String(body.email || '').trim().toLowerCase() || null,
    telefone: body.telefone || null,
    contato: body.contato || null,
    endereco: body.endereco || null,
    tipo_parceria: body.tipo_parceria || null,
    website: body.website || null,
    quantidade_vagas: body.quantidade_vagas === '' || body.quantidade_vagas == null ? null : Number(body.quantidade_vagas),
    descricao_vagas: body.descricao_vagas || null,
    aceita_estagiario: body.aceita_estagiario === 'on' || body.aceita_estagiario === true,
    observacoes: body.observacoes || null
  };
}

module.exports = { listarPublicas, formularioCadastro, solicitarCadastro, listarAdmin, listarAprovadas, formularioAdmin, criarPeloAdmin, formularioEdicao, atualizar, aprovar, excluir };
