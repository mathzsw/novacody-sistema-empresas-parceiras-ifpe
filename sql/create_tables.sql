create database novacody;
USE novacody;
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

CREATE TABLE administrador (
    id_admin INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL
);
