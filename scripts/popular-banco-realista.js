require('dotenv').config({ path: require('node:path').resolve(__dirname, '../.env') });

const sequelize = require('../config/bd');
const { Empresa, PerfilEmpresa, Categoria, Servico, Usuario, Avaliacao } = require('../models');

const organizacoes = [
  {
    nome: 'CIEE-PE',
    website: 'https://portal.ciee.org.br/',
    tipo_parceria: 'Agente de integração de estágio',
    status_empresa: 'pendente',
    observacoes: 'Organização real. O IFPE Campus Jaboatão a cita em sua página institucional de estágio como agente de integração com o qual possui convênios. Registro pendente de confirmação de vigência. Fonte: https://portal.ifpe.edu.br/jaboatao/extensao/estagio/'
  },
  {
    nome: 'IEL-PE',
    website: 'https://www.ielpe.org.br/',
    tipo_parceria: 'Agente de integração de estágio',
    status_empresa: 'pendente',
    observacoes: 'Organização real. O IFPE Campus Jaboatão a cita em sua página institucional de estágio como agente de integração com o qual possui convênios. Registro pendente de confirmação de vigência. Fonte: https://portal.ifpe.edu.br/jaboatao/extensao/estagio/'
  },
  {
    nome: 'ABRE',
    website: 'https://www.portalabre.com.br/',
    tipo_parceria: 'Agente de integração de estágio',
    status_empresa: 'pendente',
    observacoes: 'Organização real. O IFPE Campus Jaboatão a cita em sua página institucional de estágio como agente de integração com o qual possui convênios. Registro pendente de confirmação de vigência. Fonte: https://portal.ifpe.edu.br/jaboatao/extensao/estagio/'
  },
  {
    nome: 'Porto Digital',
    website: 'https://www.portodigital.org/',
    tipo_parceria: 'Residência e inovação',
    status_empresa: 'pendente',
    observacoes: 'Organização real. O Campus Jaboatão divulgou seleção para o Programa de Residência Porto Digital em 2021. Vínculo histórico; vigência atual não confirmada. Fonte: https://portal.ifpe.edu.br/jaboatao/noticias/ifpe-jaboatao-divulga-selecao-para-o-programa-de-residencia-do-porto-digital/'
  },
  {
    nome: 'Núcleo Criativo Demonstração',
    website: 'https://example.com',
    tipo_parceria: 'Empresa fictícia para demonstração',
    status_empresa: 'aprovada',
    observacoes: 'REGISTRO FICTÍCIO PARA DEMONSTRAÇÃO ACADÊMICA. Não representa empresa real nem parceria oficial com o IFPE. Dados de contato e identificação reais não foram utilizados.'
  },
  {
    nome: 'Soluções Digitais Demonstração',
    website: 'https://example.com',
    tipo_parceria: 'Empresa fictícia para demonstração',
    status_empresa: 'aprovada',
    observacoes: 'REGISTRO FICTÍCIO PARA DEMONSTRAÇÃO ACADÊMICA. Não representa empresa real nem parceria oficial com o IFPE. Dados de contato e identificação reais não foram utilizados.'
  }
];

const categorias = [
  ['Tecnologia da Informação', 'Organizações e serviços relacionados à tecnologia da informação.'],
  ['Desenvolvimento de Software', 'Desenvolvimento, manutenção e evolução de sistemas.'],
  ['Estágio e Empregabilidade', 'Integração entre estudantes, instituições de ensino e oportunidades de estágio.'],
  ['Inovação', 'Iniciativas de inovação, empreendedorismo e desenvolvimento tecnológico.']
];

async function executar() {
  if (process.env.DATABASE_URL) {
    throw new Error('Este script é exclusivo para o banco local. DATABASE_URL está configurada.');
  }

  const transacao = await sequelize.transaction();

  try {
    const demonstracoesAntigas = [
      'Aprender Tech Demonstração',
      'ByteNorte Demonstração',
      'Ponte Digital Demonstração',
      'Oficina de Inovação Demonstração'
    ];

    for (const nome of demonstracoesAntigas) {
      const empresaAntiga = await Empresa.findOne({ where: { nome }, transaction: transacao });
      if (!empresaAntiga) continue;

      await Servico.destroy({ where: { empresaId: empresaAntiga.id }, transaction: transacao });
      await Avaliacao.destroy({ where: { empresaId: empresaAntiga.id }, transaction: transacao });
      await PerfilEmpresa.destroy({ where: { empresaId: empresaAntiga.id }, transaction: transacao });
      await Usuario.destroy({ where: { empresaId: empresaAntiga.id }, transaction: transacao });
      await empresaAntiga.setCategorias([], { transaction: transacao });
      await empresaAntiga.destroy({ transaction: transacao });
    }

    const categoriasCriadas = {};

    for (const [nome, descricao] of categorias) {
      const [categoria] = await Categoria.findOrCreate({
        where: { nome },
        defaults: { descricao },
        transaction: transacao
      });
      categoriasCriadas[nome] = categoria;
    }

    for (const dados of organizacoes) {
      const [empresa, criada] = await Empresa.findOrCreate({
        where: { nome: dados.nome },
        defaults: dados,
        transaction: transacao
      });

      if (!criada) await empresa.update(dados, { transaction: transacao });

      const descricao = dados.status_empresa === 'pendente'
        ? 'Registro institucional incluído para análise. A situação do vínculo deve ser confirmada pelo campus.'
        : 'Empresa fictícia criada exclusivamente para demonstrar as funcionalidades do Novacody.';

      await PerfilEmpresa.findOrCreate({
        where: { empresaId: empresa.id },
        defaults: {
          descricao,
          redes_sociais: {}
        },
        transaction: transacao
      });

      const nomesCategorias = dados.nome === 'CIEE-PE' || dados.nome === 'IEL-PE' || dados.nome === 'ABRE'
        ? ['Estágio e Empregabilidade']
        : dados.nome === 'Porto Digital'
          ? ['Tecnologia da Informação', 'Inovação']
          : ['Tecnologia da Informação', 'Desenvolvimento de Software'];

      await empresa.setCategorias(nomesCategorias.map(nome => categoriasCriadas[nome]), { transaction: transacao });

      if (dados.status_empresa === 'aprovada') {
        const servicos = dados.nome === 'Núcleo Criativo Demonstração'
          ? [
              ['Desenvolvimento de aplicações web', 'Criação e manutenção de aplicações web para fins demonstrativos.'],
              ['Prototipagem de interfaces', 'Planejamento e prototipagem de interfaces digitais.']
            ]
          : [
              ['Consultoria em tecnologia', 'Apoio demonstrativo em planejamento e soluções de tecnologia.'],
              ['Suporte e manutenção de sistemas', 'Atendimento demonstrativo para manutenção de sistemas.']
            ];

        for (const [nome, descricaoServico] of servicos) {
          await Servico.findOrCreate({
            where: { nome, empresaId: empresa.id },
            defaults: { descricao: descricaoServico, ativo: true, empresaId: empresa.id },
            transaction: transacao
          });
        }
      }
    }

    await transacao.commit();
    console.log('Banco de demonstração atualizado e registros fictícios antigos substituídos.');
    console.log('4 organizações reais/institucionais registradas como pendentes de validação.');
    console.log('2 empresas fictícias identificadas explicitamente como demonstração.');
    console.log('Nenhum CNPJ, telefone ou e-mail real foi inventado.');
  } catch (erro) {
    await transacao.rollback();
    throw erro;
  } finally {
    await sequelize.close();
  }
}

executar().catch(erro => {
  console.error('Não foi possível popular o banco:', erro.message);
  process.exitCode = 1;
});
