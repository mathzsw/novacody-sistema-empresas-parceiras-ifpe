require('dotenv').config();
const path = require('node:path');
const express = require('express');
const session = require('express-session');
const { engine } = require('express-handlebars');
const methodOverride = require('method-override');

if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET precisa estar definido em produção.');
}

const app = express();
app.disable('x-powered-by');
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.engine('handlebars', engine({
  defaultLayout: false,
  helpers: { eq: (a, b) => String(a) === String(b) },
  runtimeOptions: { allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  name: 'novacody.sid',
  secret: process.env.SESSION_SECRET || 'desenvolvimento-local-altere-no-env',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 4
  }
}));

app.use((req, res, next) => {
  res.locals.usuarioLogado = req.session.usuario || null;
  res.locals.mensagem = req.query.mensagem || '';
  next();
});

app.use(require('./routes/authRoutes'));
app.use(require('./routes/empresaRoutes'));
app.use(require('./routes/adminRoutes'));
app.use(require('./routes/representanteRoutes'));
app.use('/api', require('./routes/apiRoutes'));

app.use((req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ erro: 'Recurso não encontrado.' });
  res.status(404).render('erros/404');
});

app.use((erro, req, res, next) => {
  console.error(erro);
  if (res.headersSent) return next(erro);
  if (req.path.startsWith('/api/')) return res.status(500).json({ erro: 'Erro interno do servidor.' });
  res.status(500).render('erros/500');
});

module.exports = app;
