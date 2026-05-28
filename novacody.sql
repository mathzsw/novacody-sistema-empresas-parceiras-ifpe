USE novacody;
SELECT * FROM empresa;

CREATE TABLE empresa (
    id_empresa INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    cnpj VARCHAR(20),
    email VARCHAR(100),
    telefone VARCHAR(20),
    contato VARCHAR(100),
    endereco VARCHAR(200),
    tipo_parceria VARCHAR(50),
    website VARCHAR(100),
    quantidade_vagas INT,
    descricao_vagas TEXT,
    aceita_estagiario BOOLEAN,
    observacoes TEXT,
    status_empresa VARCHAR(20)
);

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
VALUES (
    'Nova Tech',
    '12.345.678/0002-90',
    'contato@novatech.com.br',
    '(81) 98765-4322',
    'Carlos Henrique Andrade',
    'Rua da Inovação, 123, Boa Viagem, Recife - PE',
    'Estágio',
    'www.novatech.com.br',
    3,
    'Vagas para Desenvolvimento Web',
    TRUE,
    'Empresa busca estudantes com HTML, CSS e JavaScript',
    'pendente'
);

CREATE TABLE administrador (
    id_admin INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100),
    senha VARCHAR(100),
    nome VARCHAR(100)
);

INSERT INTO administrador (
    email,
    senha,
    nome
)
VALUES (
    'admin@docente.ifpe.edu.br',
    'ifpe@password',
    'Administrador IFPE'
);

