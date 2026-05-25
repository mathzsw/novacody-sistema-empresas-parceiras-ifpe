const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ifpecjbg',
    database: 'novacody'
});

conexao.connect((erro) => {

    if (erro) {
        console.log('Erro ao conectar no banco');
    } else {
        console.log('Banco conectado');
    }

});

app.get('/empresas', (req, res) => {

    const comando = 'SELECT * FROM empresa';

    conexao.query(comando, (erro, resultado) => {

        if (erro) {
            res.send('Erro ao buscar empresas');
        } else {
            res.json(resultado);
        }

    });

});

app.post('/empresa', (req, res) => {

    const dados = req.body;

    const comando = `
    
    INSERT INTO empresa
    (
        nome,
        cnpj,
        email,
        telefone,
        contato,
        endereco,
        tipo_parceria,
        website,
        quantidade_vagas,
        descricao_vagas,
        aceita_estagiario,
        observacoes,
        status_empresa
    )

    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    
    `;

    const valores = [

        dados.nome,
        dados.cnpj,
        dados.email,
        dados.telefone,
        dados.contato,
        dados.endereco,
        dados.tipo_parceria,
        dados.website,
        dados.quantidade_vagas,
        dados.descricao_vagas,
        dados.aceita_estagiario,
        dados.observacoes,
        'pendente'

    ];

    conexao.query(comando, valores, (erro) => {

        if (erro) {
            res.send('Erro ao cadastrar empresa');
        } else {
            res.send('Empresa cadastrada com sucesso');
        }

    });

});

app.put('/aprovar/:id', (req, res) => {

    const id = req.params.id;

    const comando = `
    
    UPDATE empresa
    SET status_empresa = 'aprovada'
    WHERE id_empresa = ?
    
    `;

    conexao.query(comando, [id], (erro) => {

        if (erro) {
            res.send('Erro ao aprovar empresa');
        } else {
            res.send('Empresa aprovada');
        }

    });

});


app.listen(3000, () => {
    console.log('Servidor rodando');
});