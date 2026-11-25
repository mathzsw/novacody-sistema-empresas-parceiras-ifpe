const router = require('express').Router();
const representante = require('../controllers/representanteController');
const { exigirRepresentante } = require('../middlewares/autenticacao');

router.get('/minha-empresa', exigirRepresentante, representante.painel);
router.post('/minha-empresa/atualizar', exigirRepresentante, representante.atualizarEmpresa);
router.post('/minha-empresa/perfil', exigirRepresentante, representante.atualizarPerfil);
router.post('/minha-empresa/servicos', exigirRepresentante, representante.criarServico);
router.post('/minha-empresa/servicos/:id/editar', exigirRepresentante, representante.atualizarServico);
router.post('/minha-empresa/servicos/:id/excluir', exigirRepresentante, representante.excluirServico);

module.exports = router;
