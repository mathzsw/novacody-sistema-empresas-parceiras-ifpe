const exphbs = require('express-handlebars');

const app = express();


app.engine('handlebars', exphbs.engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');

app.use(express.json());

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'aluno',
    password: 'ifpecjbg',
    database: 'novacody'
});

conexao.connect((erro) => {

    if (erro) {
        console.log('Erro ao conectar');
    } else {
        console.log('Banco conectado');
    }

});

app.get('/empresas', (req, res) => {

    const sql = 'SELECT * FROM empresa';

    conexao.query(sql, (erro, resultado) => {

        if (erro) {
            res.send('Erro ao buscar empresas');
        } else {
            res.render(resultado);
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
            res.send('Erro ao editar');
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
            res.send('Erro ao aprovar');
        } else {
            res.send('Empresa aprovada');
        }

    });

});



app.listen(3000, () => {
    console.log('Servidor rodando');
});