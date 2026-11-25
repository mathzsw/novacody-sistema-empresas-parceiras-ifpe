const test = require('node:test');
const assert = require('node:assert/strict');
const { exigirAdmin, exigirRepresentante } = require('../middlewares/autenticacao');

function respostaFalsa() {
  return {
    statusCode: 200,
    destino: null,
    status(codigo) { this.statusCode = codigo; return this; },
    render(view) { this.destino = view; return this; },
    redirect(url) { this.destino = url; return this; }
  };
}

test('bloqueia visitante de rota administrativa', () => {
  const req = { session: {} };
  const res = respostaFalsa();
  let continuou = false;
  exigirAdmin(req, res, () => { continuou = true; });
  assert.equal(continuou, false);
  assert.equal(res.statusCode, 403);
  assert.equal(res.destino, 'erros/403');
});

test('permite administrador autenticado', () => {
  const req = { session: { usuario: { papel: 'admin' } } };
  const res = respostaFalsa();
  let continuou = false;
  exigirAdmin(req, res, () => { continuou = true; });
  assert.equal(continuou, true);
});

test('bloqueia administrador de rota exclusiva de representante', () => {
  const req = { session: { usuario: { papel: 'admin' } } };
  const res = respostaFalsa();
  let continuou = false;
  exigirRepresentante(req, res, () => { continuou = true; });
  assert.equal(continuou, false);
  assert.equal(res.destino, '/loginempresa?mensagem=Acesse+sua+conta+para+continuar');
});
