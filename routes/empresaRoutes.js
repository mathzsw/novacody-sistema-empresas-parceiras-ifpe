const router = require('express').Router();
const empresa = require('../controllers/empresaController');
const { exigirAdmin } = require('../middlewares/autenticacao');

router.get('/', empresa.listarPublicas);
router.get('/cadastroempresa', empresa.formularioCadastro);
router.post('/empresa', empresa.solicitarCadastro);

router.get('/area-admin', exigirAdmin, empresa.listarAdmin);
router.get('/area-admin/pendentes', exigirAdmin, empresa.listarAdmin);
router.get('/area-admin/aprovadas', exigirAdmin, empresa.listarAprovadas);
router.get('/cadastroempresaadmin', exigirAdmin, empresa.formularioAdmin);
router.post('/empresa/admin', exigirAdmin, empresa.criarPeloAdmin);
router.get('/empresa/editar/:id', exigirAdmin, empresa.formularioEdicao);
router.post('/empresa/editar/:id', exigirAdmin, empresa.atualizar);
router.post('/empresa/aprovar/:id', exigirAdmin, empresa.aprovar);
router.post('/empresa/deletar/:id', exigirAdmin, empresa.excluir);

module.exports = router;
