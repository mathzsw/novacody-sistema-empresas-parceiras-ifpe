const router = require('express').Router();
const { exigirAdmin } = require('../middlewares/autenticacao');
const { Empresa, Categoria, Avaliacao, PerfilEmpresa, EmpresaCategoria } = require('../models');

router.get('/empresas', async (req, res, next) => {
  try {
    const empresas = await Empresa.findAll({
      where: { status_empresa: 'aprovada' },
      attributes: ['id', 'nome', 'email', 'telefone', 'endereco', 'tipo_parceria', 'website', 'quantidade_vagas'],
      include: [{ model: Categoria, as: 'categorias', attributes: ['id', 'nome'], through: { attributes: [] }, required: false }],
      order: [['nome', 'ASC']]
    });
    res.json({ dados: empresas });
  } catch (erro) { next(erro); }
});

router.get('/categorias', async (req, res, next) => {
  try { res.json({ dados: await Categoria.findAll({ order: [['nome', 'ASC']] }) }); }
  catch (erro) { next(erro); }
});

router.use('/admin', exigirAdmin);

router.get('/admin/categorias', async (req, res, next) => {
  try { res.json({ dados: await Categoria.findAll({ order: [['nome', 'ASC']] }) }); }
  catch (erro) { next(erro); }
});
router.post('/admin/categorias', async (req, res, next) => {
  try {
    const categoria = await Categoria.create({ nome: String(req.body.nome || '').trim(), descricao: req.body.descricao || null });
    res.status(201).json({ dados: categoria });
  } catch (erro) { next(erro); }
});
router.put('/admin/categorias/:id', async (req, res, next) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ erro: 'Categoria não encontrada.' });
    await categoria.update({ nome: String(req.body.nome || categoria.nome).trim(), descricao: req.body.descricao ?? categoria.descricao });
    res.json({ dados: categoria });
  } catch (erro) { next(erro); }
});
router.delete('/admin/categorias/:id', async (req, res, next) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ erro: 'Categoria não encontrada.' });
    await categoria.destroy();
    res.status(204).end();
  } catch (erro) { next(erro); }
});

router.get('/admin/avaliacoes', async (req, res, next) => {
  try {
    const avaliacoes = await Avaliacao.findAll({ include: [{ model: Empresa, as: 'empresa', attributes: ['id', 'nome'] }], order: [['createdAt', 'DESC']] });
    res.json({ dados: avaliacoes });
  } catch (erro) { next(erro); }
});
router.post('/admin/avaliacoes', async (req, res, next) => {
  try {
    const empresa = await Empresa.findByPk(req.body.empresaId);
    if (!empresa) return res.status(400).json({ erro: 'Empresa inválida.' });
    const avaliacao = await Avaliacao.create({
      empresaId: empresa.id,
      autor: String(req.body.autor || '').trim(),
      nota: Number(req.body.nota),
      comentario: String(req.body.comentario || '').trim(),
      status: 'pendente'
    });
    res.status(201).json({ dados: avaliacao });
  } catch (erro) { next(erro); }
});
router.put('/admin/avaliacoes/:id', async (req, res, next) => {
  try {
    const avaliacao = await Avaliacao.findByPk(req.params.id);
    if (!avaliacao) return res.status(404).json({ erro: 'Avaliação não encontrada.' });
    await avaliacao.update({
      autor: req.body.autor ?? avaliacao.autor,
      nota: req.body.nota == null ? avaliacao.nota : Number(req.body.nota),
      comentario: req.body.comentario ?? avaliacao.comentario,
      status: req.body.status ?? avaliacao.status
    });
    res.json({ dados: avaliacao });
  } catch (erro) { next(erro); }
});
router.delete('/admin/avaliacoes/:id', async (req, res, next) => {
  try {
    const avaliacao = await Avaliacao.findByPk(req.params.id);
    if (!avaliacao) return res.status(404).json({ erro: 'Avaliação não encontrada.' });
    await avaliacao.destroy();
    res.status(204).end();
  } catch (erro) { next(erro); }
});

router.get('/admin/perfis', async (req, res, next) => {
  try {
    res.json({ dados: await PerfilEmpresa.findAll({ include: [{ model: Empresa, as: 'empresa', attributes: ['id', 'nome'] }] }) });
  } catch (erro) { next(erro); }
});
router.post('/admin/perfis', async (req, res, next) => {
  try {
    const empresa = await Empresa.findByPk(req.body.empresaId);
    if (!empresa) return res.status(400).json({ erro: 'Empresa inválida.' });
    const [perfil, criado] = await PerfilEmpresa.findOrCreate({
      where: { empresaId: empresa.id },
      defaults: { descricao: req.body.descricao || null, logotipo: req.body.logotipo || null, horario_funcionamento: req.body.horario_funcionamento || null }
    });
    if (!criado) return res.status(409).json({ erro: 'A empresa já possui um perfil.' });
    res.status(201).json({ dados: perfil });
  } catch (erro) { next(erro); }
});
router.put('/admin/perfis/:id', async (req, res, next) => {
  try {
    const perfil = await PerfilEmpresa.findByPk(req.params.id);
    if (!perfil) return res.status(404).json({ erro: 'Perfil não encontrado.' });
    await perfil.update({
      descricao: req.body.descricao ?? perfil.descricao,
      logotipo: req.body.logotipo ?? perfil.logotipo,
      horario_funcionamento: req.body.horario_funcionamento ?? perfil.horario_funcionamento
    });
    res.json({ dados: perfil });
  } catch (erro) { next(erro); }
});
router.delete('/admin/perfis/:id', async (req, res, next) => {
  try {
    const perfil = await PerfilEmpresa.findByPk(req.params.id);
    if (!perfil) return res.status(404).json({ erro: 'Perfil não encontrado.' });
    await perfil.destroy();
    res.status(204).end();
  } catch (erro) { next(erro); }
});

router.post('/admin/empresa-categorias', async (req, res, next) => {
  try {
    const empresa = await Empresa.findByPk(req.body.empresaId);
    const categoria = await Categoria.findByPk(req.body.categoriaId);
    if (!empresa || !categoria) return res.status(400).json({ erro: 'Empresa ou categoria inválida.' });
    const [vinculo, criado] = await EmpresaCategoria.findOrCreate({
      where: { empresaId: empresa.id, categoriaId: categoria.id }
    });
    if (!criado) return res.status(409).json({ erro: 'Esse vínculo já existe.' });
    res.status(201).json({ dados: vinculo });
  } catch (erro) { next(erro); }
});
router.delete('/admin/empresa-categorias', async (req, res, next) => {
  try {
    const removidos = await EmpresaCategoria.destroy({ where: { empresaId: req.body.empresaId, categoriaId: req.body.categoriaId } });
    if (!removidos) return res.status(404).json({ erro: 'Vínculo não encontrado.' });
    res.status(204).end();
  } catch (erro) { next(erro); }
});

module.exports = router;
