import { useEffect, useMemo, useState } from 'react';

export default function App() {
  const [empresas, setEmpresas] = useState([]);
  const [busca, setBusca] = useState('');
  const [tipo, setTipo] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/empresas', { signal: controller.signal })
      .then((resposta) => {
        if (!resposta.ok) throw new Error('Não foi possível carregar as empresas.');
        return resposta.json();
      })
      .then((resultado) => setEmpresas(resultado.dados || []))
      .catch((falha) => {
        if (falha.name !== 'AbortError') setErro(falha.message);
      })
      .finally(() => setCarregando(false));
    return () => controller.abort();
  }, []);

  const filtradas = useMemo(() => empresas.filter((empresa) => {
    const termo = busca.toLocaleLowerCase('pt-BR');
    const correspondeBusca = [empresa.nome, empresa.email, empresa.endereco]
      .some((valor) => String(valor || '').toLocaleLowerCase('pt-BR').includes(termo));
    return correspondeBusca && (!tipo || empresa.tipo_parceria === tipo);
  }), [empresas, busca, tipo]);

  return (
    <main className="uk-container uk-container-large app-shell">
      <header className="topbar">
        <div><span className="eyebrow">IFPE · Jaboatão</span><h1>Novacody</h1><p>Empresas parceiras e oportunidades</p></div>
        <a className="uk-button uk-button-default" href="http://localhost:3000">Sistema principal</a>
      </header>
      <section className="toolbar uk-card uk-card-default uk-card-body">
        <div><label className="uk-form-label" htmlFor="busca">Buscar empresa</label><input id="busca" className="uk-input" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Nome, e-mail ou endereço" /></div>
        <div><label className="uk-form-label" htmlFor="tipo">Tipo de parceria</label><select id="tipo" className="uk-select" value={tipo} onChange={(e) => setTipo(e.target.value)}><option value="">Todas as modalidades</option><option>Estágio</option><option>Emprego</option><option>Projeto de Extensão</option></select></div>
        <span className="result-count">{filtradas.length} empresa(s)</span>
      </section>
      {carregando && <p className="state-message">Carregando empresas...</p>}
      {erro && <div className="uk-alert-danger" role="alert">{erro}</div>}
      {!carregando && !erro && filtradas.length === 0 && <p className="state-message">Nenhuma empresa encontrada.</p>}
      <section className="company-grid">
        {filtradas.map((empresa) => (
          <article className="uk-card uk-card-default uk-card-body company-card" key={empresa.id}>
            <span className="company-type">{empresa.tipo_parceria || 'Parceria IFPE'}</span>
            <h2>{empresa.nome}</h2>
            {empresa.endereco && <p>{empresa.endereco}</p>}
            {empresa.email && <a href={'mailto:' + empresa.email}>{empresa.email}</a>}
            {empresa.quantidade_vagas > 0 && <p className="vacancies">{empresa.quantidade_vagas} vaga(s)</p>}
            {empresa.categorias?.length > 0 && <div className="tags">{empresa.categorias.map((categoria) => <span key={categoria.id}>{categoria.nome}</span>)}</div>}
          </article>
        ))}
      </section>
    </main>
  );
}
