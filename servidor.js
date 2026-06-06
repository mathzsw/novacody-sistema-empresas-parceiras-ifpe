const express = require('express');
const exphbs = require('express-handlebars');
const mysql = require('mysql2');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs.engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ifpecjbg',
    database: 'novacody'
});

conexao.connect((erro) => {
    if (erro) {
        console.log("ERRO COMPLETO:", erro);
    } else {
        console.log("Conectado com sucesso!");
    }
});

app.get('/empresas', (req, res) => {

    const sql = 'SELECT * FROM empresa';

    conexao.query(sql, (erro, resultado) => {

        if (erro) {
            res.send('Erro ao buscar empresas');
        } else {
            res.json(resultado); // CORRIGIDO
        }

    });

});

app.post('/empresa', (req, res) => {

    const dados = req.body;

    const sql = `
        INSERT INTO empresa (
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

    conexao.query(sql, valores, (erro) => {

        if (erro) {
            res.send('Erro ao cadastrar empresa');
        } else {
            res.send('Empresa cadastrada');
        }

    });

});

app.put('/empresa/:id', (req, res) => {

    const id = req.params.id;
    const dados = req.body;

    const sql = `
        UPDATE empresa
        SET
            nome = ?,
            cnpj = ?,
            email = ?,
            telefone = ?,
            contato = ?,
            endereco = ?,
            tipo_parceria = ?,
            website = ?,
            quantidade_vagas = ?,
            descricao_vagas = ?,
            aceita_estagiario = ?,
            observacoes = ?,
            status_empresa = ?
        WHERE id_empresa = ?
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
        dados.status_empresa,
        id
    ];

    conexao.query(sql, valores, (erro) => {

        if (erro) {
            res.send('Erro ao editar empresa');
        } else {
            res.send('Empresa editada');
        }

    });

});

app.put('/empresa/aprovar/:id', (req, res) => {

    const id = req.params.id;

    const sql = `
        UPDATE empresa
        SET status_empresa = 'aprovada'
        WHERE id_empresa = ?
    `;

    conexao.query(sql, [id], (erro) => {

        if (erro) {
            res.send('Erro ao aprovar empresa');
        } else {
            res.send('Empresa aprovada');
        }

    });

});

app.delete('/empresa/:id', (req, res) => {

    const id = req.params.id;

    const sql = 'DELETE FROM empresa WHERE id_empresa = ?';

    conexao.query(sql, [id], (erro) => {

        if (erro) {
            res.send('Erro ao deletar empresa');
        } else {
            res.send('Empresa removida');
        }

    });

});

app.listen(3000, () => {
    console.log('Servidor rodando');
});