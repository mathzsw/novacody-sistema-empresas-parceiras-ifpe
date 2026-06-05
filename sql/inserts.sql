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
