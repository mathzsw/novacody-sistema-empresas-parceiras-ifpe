const express = require('express');
const exphbs = require('express-handlebars');

const sequelize = require('./config/bd');
const Empresa = require('./models/Empresa');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs.engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');

sequelize.sync()
    .then(() => {
        console.log('Banco conectado!');
    })
    .catch((erro) => {
        console.log('Erro ao conectar:', erro);
    });

app.get('/', async (req, res) => {
    try {
        const empresas = await Empresa.findAll();

        res.render('index', { empresas });

    } catch (erro) {
        res.send('Erro ao carregar página inicial');
    }
});

app.get('/area-admin', (req, res) => {
    res.render('areaadmin');
});

app.get('/pendentes', async (req, res) => {
    try {
        const empresas = await Empresa.findAll({
            where: { status_empresa: 'pendente' }
        });

        res.render('pendentes', { empresas });

    } catch (erro) {
        res.send('Erro ao buscar pendentes');
    }
});

app.get('/aprovadas', async (req, res) => {
    try {
        const empresas = await Empresa.findAll({
            where: { status_empresa: 'aprovada' }
        });

        res.render('aprovadas', { empresas });

    } catch (erro) {
        res.send('Erro ao buscar aprovadas');
    }
});

app.post('/empresa', async (req, res) => {
    try {
        await Empresa.create({
            nome: req.body.nome,
            cnpj: req.body.cnpj,
            email: req.body.email,
            telefone: req.body.telefone,
            contato: req.body.contato,
            endereco: req.body.endereco,
            tipo_parceria: req.body.tipo_parceria,
            website: req.body.website,
            quantidade_vagas: req.body.quantidade_vagas,
            descricao_vagas: req.body.descricao_vagas,
            aceita_estagiario: req.body.aceita_estagiario,
            observacoes: req.body.observacoes,
            status_empresa: 'pendente'
        });

        res.redirect('/');

    } catch (erro) {
        res.send('Erro ao cadastrar empresa');
    }
});

app.put('/empresa/:id', async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id);

        if (!empresa) {
            return res.send('Empresa não encontrada');
        }

        await empresa.update(req.body);

        res.send('Empresa editada');

    } catch (erro) {
        res.send('Erro ao editar empresa');
    }
});

app.put('/empresa/aprovar/:id', async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id);

        if (!empresa) {
            return res.send('Empresa não encontrada');
        }

        await empresa.update({
            status_empresa: 'aprovada'
        });

        res.send('Empresa aprovada');

    } catch (erro) {
        res.send('Erro ao aprovar empresa');
    }
});

app.delete('/empresa/:id', async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id);

        if (!empresa) {
            return res.send('Empresa não encontrada');
        }

        await empresa.destroy();

        res.send('Empresa removida');

    } catch (erro) {
        res.send('Erro ao deletar empresa');
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
