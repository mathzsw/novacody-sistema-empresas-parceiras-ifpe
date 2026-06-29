const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const sequelize = require('./config/bd');
const Empresa = require('./models/Empresa');
const { Op } = require('sequelize');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs.engine({ 
    defaultLayout: false,
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    }
}));
app.set('view engine', 'handlebars');

sequelize.sync()
    .then(() => {
        console.log('Banco conectado!');
    })
    .catch((erro) => {
        console.log('Erro ao conectar:', erro);
    });

app.get('/', async (req, res) => {

    const busca = req.query.busca || '';
    const tipo = req.query.tipo || '';

    let where = {
        status_empresa: 'aprovada'
    };

    if (busca) {
        where[Op.or] = [
            {
                nome: {
                    [Op.like]: `%${busca}%`
                }
            },
            {
                cnpj: {
                    [Op.like]: `%${busca}%`
                }
            },
            {
                email: {
                    [Op.like]: `%${busca}%`
                }
            },
            {
                contato: {
                    [Op.like]: `%${busca}%`
                }
            }
        ];
    }

    if (tipo) {
    where.tipo_parceria = {
        [Op.like]: `%${tipo}%`
    };
}
    const empresas = await Empresa.findAll({
        where
    });

    res.render('index', {
    empresas,
    busca,
    estagio: tipo === 'Estágio' ? 'selected' : '',
    emprego: tipo === 'Emprego' ? 'selected' : '',
    projeto: tipo === 'Projeto de Extensão' ? 'selected' : ''
});
});

app.get('/area-admin', async (req, res) => {
    const pendentes = await Empresa.findAll({
        where: {
            status_empresa: 'pendente'
        }
    });

    const aprovadas = await Empresa.findAll({
        where: {
            status_empresa: 'aprovada'
        }
    });

    res.render('areaadmin', {
        pendentes,
        aprovadas
    });
});

app.get('/cadastroempresa', (req, res) => {
    res.render('cadastroempresa', {
    sucesso: true
});
});

app.get('/cadastroempresaadmin', (req, res) => {
    res.render('cadastroempresaadmin'); 
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
            aceita_estagiario: req.body.aceita_estagiario === 'on' ? true : false,
            observacoes: req.body.observacoes,
            status_empresa: 'pendente'
        });

        res.render('cadastroconcluido');

    } catch (erro) {
        res.send('Erro ao cadastrar empresa');
    }
});

app.post('/empresa/admin', async (req, res) => {
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
            aceita_estagiario: req.body.aceita_estagiario === 'on' ? true : false,
            observacoes: req.body.observacoes,
            status_empresa: 'aprovada'
        });

        res.redirect('/');

    } catch (erro) {
        console.log(erro);
        res.send('Erro ao cadastrar empresa pelo painel admin');
    }
});

app.get('/empresa/editar/:id', async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id);

        if (!empresa) {
            return res.send('Empresa não encontrada');
        }

        res.render('editarempresa', {
            empresa
        });

    } catch (erro) {
        res.send('Erro ao carregar empresa');
    }
});

app.post('/empresa/editar/:id', async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id);

        if (!empresa) {
            return res.send('Empresa não encontrada');
        }

        await empresa.update({
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
            aceita_estagiario:
                req.body.aceita_estagiario === 'on',
            observacoes: req.body.observacoes
        });

        res.redirect('/area-admin');

    } catch (erro) {
        res.send('Erro ao editar empresa');
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

app.post('/empresa/aprovar/:id', async (req, res) => {
    const empresa = await Empresa.findByPk(req.params.id);

    if (!empresa) {
        return res.send('Empresa não encontrada');
    }

    await empresa.update({
        status_empresa: 'aprovada'
    });

    res.redirect('/area-admin');
});

app.post('/empresa/deletar/:id', async (req, res) => {
    const empresa = await Empresa.findByPk(req.params.id);

    if (!empresa) {
        return res.send('Empresa não encontrada');
    }

    await empresa.destroy();

    res.redirect('/area-admin');
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
