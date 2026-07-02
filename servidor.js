const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const sequelize = require('./config/bd');
const Empresa = require('./models/empresa');
const Admin = require('./models/admin');
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

//CRUD EMPRESAS - MATHEUS

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

app.get('/loginadmin', (req, res) => {
    res.render('administradores/login');
});

app.get('/area-admin', (req, res) => {
    res.redirect('/area-admin/pendentes');
});

app.get('/area-admin/pendentes', async (req, res) => {
    try {
        const pendentes = await Empresa.findAll({
            where: {
                status_empresa: 'pendente'
            }
        });

        res.render('area-admin/pendentes', {
            pendentes
        });

    } catch (erro) {
        console.log(erro);
        res.send('Erro ao carregar empresas pendentes');
    }
});

app.get('/area-admin/aprovadas', async (req, res) => {
    try {
        const aprovadas = await Empresa.findAll({
            where: {
                status_empresa: 'aprovada'
            }
        });

        res.render('area-admin/aprovadas', {
            aprovadas
        });

    } catch (erro) {
        console.log(erro);
        res.send('Erro ao carregar empresas aprovadas');
    }
});

app.get('/cadastroempresa', (req, res) => {
    res.render('cadastroempresa');
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
            aceita_estagiario:
                req.body.aceita_estagiario === 'on',
            observacoes: req.body.observacoes,
            status_empresa: 'pendente'
        });

        res.render('cadastroconcluido');

    } catch (erro) {
        console.log(erro);
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
            aceita_estagiario:
                req.body.aceita_estagiario === 'on',
            observacoes: req.body.observacoes,
            status_empresa: 'aprovada'
        });

        res.redirect('/area-admin/aprovadas');

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
        console.log(erro);
        res.send('Erro ao carregar empresa');
    }
});


app.post('/empresa/editar/:id', async (req, res) => {
    try {

        const empresa = await Empresa.findByPk(req.params.id);

        if (!empresa) {
            return res.send('Empresa não encontrada');
        }

        const status = empresa.status_empresa;

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

        if (status === 'pendente') {
            res.redirect('/area-admin/pendentes');
        } else {
            res.redirect('/area-admin/aprovadas');
        }

    } catch (erro) {
        console.log(erro);
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

    res.redirect('/area-admin/pendentes');
});

app.post('/empresa/deletar/:id', async (req, res) => {

    const empresa = await Empresa.findByPk(req.params.id);

    if (!empresa) {
        return res.send('Empresa não encontrada');
    }

    const status = empresa.status_empresa;

    await empresa.destroy();

    if (status === 'pendente') {
        res.redirect('/area-admin/pendentes');
    } else {
        res.redirect('/area-admin/aprovadas');
    }
});

// CRUD ADMINS - THAIS



app.get('/usuarios', async (req, res) => {
   try {


       const administradores = await Admin.findAll();


       res.render('administradores/index', {
           administradores
       });


   } catch (erro) {
       console.log(erro);
       res.send('Erro ao carregar administradores');
   }
});


app.get('/usuarios/cadastrar', (req, res) => {
   res.render('administradores/cadastrar');
});


app.post('/usuarios', async (req, res) => {
   try {


       await Admin.create({
           nome: req.body.nome,
           email: req.body.email,
           senha: req.body.senha,
           tipo: req.body.tipo
       });


       res.redirect('/usuarios');


   } catch (erro) {
       console.log(erro);
       res.send('Erro ao cadastrar administrador');
   }
});


app.get('/usuarios/editar/:id', async (req, res) => {
   try {


       const administrador = await Admin.findByPk(req.params.id);


       if (!administrador) {
           return res.send('Administrador não encontrado');
       }


       res.render('administradores/editar', {
           administrador
       });


   } catch (erro) {
       console.log(erro);
       res.send('Erro ao carregar administrador');
   }
});


app.post('/usuarios/editar/:id', async (req, res) => {
   try {


       const administrador = await Admin.findByPk(req.params.id);


       if (!administrador) {
           return res.send('Administrador não encontrado');
       }


       await administrador.update({
           nome: req.body.nome,
           email: req.body.email,
           senha: req.body.senha,
           tipo: req.body.tipo
       });


       res.redirect('/usuarios');


   } catch (erro) {
       console.log(erro);
       res.send('Erro ao editar administrador');
   }
});


app.post('/usuarios/deletar/:id', async (req, res) => {


   const administrador = await Admin.findByPk(req.params.id);


   if (!administrador) {
       return res.send('Administrador não encontrado');
   }


   await administrador.destroy();


   res.redirect('/usuarios');
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});