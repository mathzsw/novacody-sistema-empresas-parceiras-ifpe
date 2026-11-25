# Novacody — Sistema de Empresas Parceiras do IFPE

Sistema web para cadastro, consulta e gerenciamento de empresas parceiras do Instituto Federal de Pernambuco — Campus Jaboatão dos Guararapes.

## Equipe

- **Matheus Augusto Rodrigues de Alencar** — interface, integração e funcionalidades de empresas.
- **Thaís Myller** (GitHub: [@taismll](https://github.com/taismll)) — colaboradora do projeto, com participação no gerenciamento administrativo, organização e desenvolvimento das funcionalidades.

## Implementações desta etapa — 25/11/2026

- Separação da configuração Express (app.js) do ponto de entrada (servidor.js).
- Organização em rotas, controllers, middlewares e models.
- Login administrativo e de representantes com sessão.
- Hash de senhas com bcrypt, incluindo migração automática de senhas antigas no primeiro login válido.
- Proteção de rotas administrativas e isolamento do painel do representante à própria empresa.
- Models: Admin, Empresa, PerfilEmpresa, Usuario, Categoria, Servico, Avaliacao e EmpresaCategoria.
- Associações 1:1, 1:N e N:N.
- Banco configurável: SQLite para desenvolvimento e PostgreSQL para Supabase por variável de ambiente.
- API pública de empresas e categorias.
- API administrativa para gerenciamento de categorias, perfis, avaliações e vínculos empresa-categoria.
- Aplicação React separada com Vite e UIkit para listar e filtrar empresas aprovadas.
- Script para criação segura do primeiro administrador.
- Gestão administrativa de contas dos representantes e painel privado da empresa.

## Tecnologias

Node.js, Express 5, Express Handlebars, Sequelize 6, SQLite, PostgreSQL/Supabase, bcrypt, express-session, dotenv, React, Vite e UIkit.

## Executar localmente

Requisito: Node.js 22.23.4 ou superior.

1. Instale as dependências:

```bash
npm install
```

2. Copie .env.example para .env e defina SESSION_SECRET. Para continuar usando SQLite local, deixe DATABASE_URL vazio.

3. Crie o primeiro administrador:

```bash
npm run admin:create
```

4. Inicie o servidor:

```bash
npm run dev
```

Acesse http://localhost:3000.

## Aplicação React

Em outro terminal:

```bash
npm --prefix react-app install
npm run dev:react
```

A aplicação React fica em http://localhost:5173 e consome a API do Express em /api/empresas. Para gerar a versão de produção:

```bash
npm run build:react
```

## API administrativa

Todas as rotas abaixo exigem sessão de administrador:

- GET, POST /api/admin/categorias
- PUT, DELETE /api/admin/categorias/:id
- GET, POST /api/admin/avaliacoes
- PUT, DELETE /api/admin/avaliacoes/:id
- GET, POST /api/admin/perfis
- PUT, DELETE /api/admin/perfis/:id
- POST, DELETE /api/admin/empresa-categorias

A API pública disponibiliza GET /api/empresas e GET /api/categorias.

## Banco de dados

Sem DATABASE_URL, o projeto utiliza database.sqlite. Para Supabase, configure DATABASE_URL com a connection string PostgreSQL do projeto e DATABASE_SSL=true quando exigido pelo provedor.

**Importante:** sequelize.sync() está mantido para desenvolvimento. Antes de produção, a equipe deve criar migrations, configurar armazenamento de sessão persistente e definir SESSION_SECRET forte. Nunca publique o arquivo .env. O armazenamento padrão de sessões em memória não é adequado para produção.

## Regras de acesso

- Visitantes consultam somente empresas aprovadas.
- Administradores autenticados gerenciam empresas e contas administrativas.
- Representantes autenticados acessam e atualizam somente os dados vinculados à própria empresa.
- O cadastro público não cria contas de acesso; contas de representantes são provisionadas pela administração.

## Estrutura

```text
config/          conexão com banco
controllers/     regras das requisições
middlewares/     autenticação e autorização
models/          entidades e associações Sequelize
routes/          rotas web e API
scripts/         tarefas administrativas
tests/           testes automatizados
views/           páginas Handlebars
public/          arquivos estáticos
react-app/       aplicação React + UIkit
app.js           configuração Express
servidor.js      inicialização
```

## Repositório

[GitHub — Novacody](https://github.com/mathzsw/novacody-sistema-empresas-parceiras-ifpe)

A evolução de Desenvolvimento Web está em branch separada para revisão da equipe antes da integração. Matheus e Thaís devem testar e revisar as funcionalidades em conjunto.
