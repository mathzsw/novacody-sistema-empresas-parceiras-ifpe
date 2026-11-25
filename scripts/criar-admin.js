require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('../config/bd');
const { Admin } = require('../models');

async function executar() {
  const nome = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const senha = process.env.ADMIN_PASSWORD;
  if (!nome || !email || !senha || senha.length < 8) {
    throw new Error('Defina ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD (mínimo de 8 caracteres) no .env.');
  }
  await sequelize.authenticate();
  await sequelize.sync();
  const existente = await Admin.findOne({ where: { email: email.toLowerCase() } });
  if (existente) throw new Error('Já existe um administrador com esse e-mail.');
  await Admin.create({
    nome,
    email: email.toLowerCase(),
    senha: await bcrypt.hash(senha, 12),
    tipo: 'admin'
  });
  console.log('Administrador inicial criado. Altere/remova a senha do .env.');
}

executar()
  .catch((erro) => { console.error(erro.message); process.exitCode = 1; })
  .finally(() => sequelize.close());
