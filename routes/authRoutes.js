const router = require('express').Router();
const auth = require('../controllers/authController');

router.get('/loginadmin', (req, res) => res.render('administradores/login'));
router.post('/loginadmin', auth.loginAdmin);
router.get('/loginempresa', (req, res) => res.render('usuarios/login'));
router.post('/loginempresa', auth.loginRepresentante);
router.post('/logout', auth.logout);

module.exports = router;
