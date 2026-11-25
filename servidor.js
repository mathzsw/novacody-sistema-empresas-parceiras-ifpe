require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/bd');
require('./models');

const PORT = Number(process.env.PORT) || 3000;

async function iniciarServidor() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Banco conectado e modelos sincronizados.');
    app.listen(PORT, () => console.log('Novacody disponível em http://localhost:' + PORT));
  } catch (erro) {
    console.error('Não foi possível iniciar o Novacody:', erro);
    process.exit(1);
  }
}

iniciarServidor();
