const { Empresa, PerfilEmpresa, Servico, Avaliacao } = require('../models');

async function painel(req, res, next) {
  try {
    const empresa = await Empresa.findByPk(req.session.usuario.empresaId, {
      include: [
        { model: PerfilEmpresa, as: 'perfil' },
        { model: Servico, as: 'servicos' },
        { model: Avaliacao, as: 'avaliacoes', where: { status: 'aprovada' }, required: false }
      ]
    });
    if (!empresa) return res.status(404).render('erros/404');
    res.render('usuarios/painel', { empresa });
  } catch (erro) { next(erro); }
}

async function atualizarEmpresa(req, res, next) {
  try {
    const empresa = await Empresa.findByPk(req.session.usuario.empresaId);
    if (!empresa) return res.status(404).render('erros/404');
    await empresa.update({
      telefone: req.body.telefone || null,
      contato: req.body.contato || null,
      endereco: req.body.endereco || null,
      website: req.body.website || null,
      descricao_vagas: req.body.descricao_vagas || null,
      observacoes: req.body.observacoes || null
    });
    res.redirect('/minha-empresa?mensagem=Dados+atualizados');
  } catch (erro) { next(erro); }
}

async function atualizarPerfil(req, res, next) {
  try {
    const empresaId = req.session.usuario.empresaId;
    const [perfil] = await PerfilEmpresa.findOrCreate({ where: { empresaId }, defaults: { descricao: req.body.descricao || '' } });
    await perfil.update({
      descricao: req.body.descricao || '',
      logotipo: req.body.logotipo || null,
      horario_funcionamento: req.body.horario_funcionamento || null
    });
    res.redirect('/minha-empresa?mensagem=Perfil+atualizado');
  } catch (erro) { next(erro); }
}

async function criarServico(req, res, next) {
  try {
    await Servico.create({ empresaId: req.session.usuario.empresaId, nome: req.body.nome, descricao: req.body.descricao });
    res.redirect('/minha-empresa');
  } catch (erro) { next(erro); }
}

async function atualizarServico(req, res, next) {
  try {
    const servico = await Servico.findOne({ where: { id: req.params.id, empresaId: req.session.usuario.empresaId } });
    if (!servico) return res.status(404).render('erros/404');
    await servico.update({ nome: req.body.nome, descricao: req.body.descricao, ativo: req.body.ativo === 'on' });
    res.redirect('/minha-empresa');
  } catch (erro) { next(erro); }
}

async function excluirServico(req, res, next) {
  try {
    const servico = await Servico.findOne({ where: { id: req.params.id, empresaId: req.session.usuario.empresaId } });
    if (!servico) return res.status(404).render('erros/404');
    await servico.destroy();
    res.redirect('/minha-empresa');
  } catch (erro) { next(erro); }
}

module.exports = { painel, atualizarEmpresa, atualizarPerfil, criarServico, atualizarServico, excluirServico };
