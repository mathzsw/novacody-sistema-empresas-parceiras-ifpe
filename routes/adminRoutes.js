const router = require('express').Router();
const admin = require('../controllers/adminController');
const usuarios = require('../controllers/usuarioController');
const { exigirAdmin } = require('../middlewares/autenticacao');

router.get('/usuarios', exigirAdmin, admin.listar);
router.get('/usuarios/cadastrar', exigirAdmin, admin.formularioCadastro);
router.post('/usuarios', exigirAdmin, admin.criar);
router.get('/usuarios/editar/:id', exigirAdmin, admin.formularioEdicao);
router.post('/usuarios/editar/:id', exigirAdmin, admin.atualizar);
router.post('/usuarios/deletar/:id', exigirAdmin, admin.excluir);

router.get('/representantes', exigirAdmin, usuarios.listarRepresentantes);
router.get('/representantes/cadastrar', exigirAdmin, usuarios.formularioCadastro);
router.post('/representantes', exigirAdmin, usuarios.criar);
router.get('/representantes/:id/editar', exigirAdmin, usuarios.formularioEdicao);
router.post('/representantes/:id/editar', exigirAdmin, usuarios.atualizar);
router.post('/representantes/:id/excluir', exigirAdmin, usuarios.excluir);

module.exports = router;
