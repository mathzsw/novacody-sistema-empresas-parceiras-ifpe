function exigirLogin(req, res, next) {
  if (!req.session.usuario) return res.redirect('/loginadmin?mensagem=Faça+login+para+continuar');
  next();
}

function exigirAdmin(req, res, next) {
  if (!req.session.usuario || req.session.usuario.papel !== 'admin') {
    return res.status(403).render('erros/403');
  }
  next();
}

function exigirRepresentante(req, res, next) {
  if (!req.session.usuario || req.session.usuario.papel !== 'representante') {
    return res.redirect('/loginempresa?mensagem=Acesse+sua+conta+para+continuar');
  }
  next();
}

module.exports = { exigirLogin, exigirAdmin, exigirRepresentante };
