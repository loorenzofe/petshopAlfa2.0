/* ==========================================================================
   api.js — CAMADA DE DADOS
   --------------------------------------------------------------------------
   TODO acesso a dados do site passa por este arquivo. O resto do código
   (site.js e admin.js) só chama as funções do objeto `Api` e não sabe de
   onde os dados vêm.

   Dois modos de funcionamento:
   • API_URL vazio  → MODO DEMONSTRAÇÃO: os dados ficam salvos no navegador
                      (localStorage). Serve para apresentar o front sozinho.
   • API_URL preenchido → MODO BACK-END: as funções chamam as rotas do
                      servidor com fetch().

   O formato dos objetos e as rotas esperadas estão no README, na seção
   "Contrato com o back-end".
   ========================================================================== */

// Quando o back-end estiver no ar, coloque o endereço aqui.
// Exemplo: const API_URL = 'http://localhost:3000';
const API_URL = '';

const Api = (() => {
  const MODO_DEMO = !API_URL;

  // Chaves usadas no localStorage / sessionStorage
  // O ":v2" faz o navegador ignorar os dados de exemplo antigos
  // (fotos erradas) salvos por versões anteriores do site.
  const CHAVES = {
    filhotes: 'soFilhotes:filhotes:v2',
    interessados: 'soFilhotes:interessados:v2',
    sessao: 'soFilhotes:sessao',
  };
  ['soFilhotes:filhotes', 'soFilhotes:interessados', 'soFilhotesDogs', 'soFilhotesActivities'].forEach((chaveAntiga) => {
    try {
      localStorage.removeItem(chaveAntiga);
    } catch {
      /* sem armazenamento */
    }
  });

  // Login de demonstração (só vale no modo demonstração).
  // No modo back-end quem confere usuário e senha é o servidor.
  const LOGIN_DEMO = { email: 'admin@sofilhotes.com', senha: 'admin123', nome: 'Administrador' };

  /* ------------------------------------------------------------------------
     Dados de exemplo (usados só no modo demonstração)
     ------------------------------------------------------------------------ */
  // Fotos: Unsplash (uso gratuito). Conferidas uma a uma para bater com a raça.
  const foto = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

  const FILHOTES_EXEMPLO = [
    {
      id: 1, nome: 'Thor', raca: 'Spitz Alemão', sexo: 'Macho',
      nascimento: '2026-01-20', preco: 3500, status: 'Disponível',
      porte: 'Pequeno', pelagem: 'Laranja',
      foto: foto('photo-1578900194624-e52cd16da379'),
      descricao: 'Carinhoso, equilibrado e muito sociável. Adora companhia e brincadeiras.',
      saude: { vacinas: ['V8/V10', 'Antirrábica'], vermifugado: true, microchip: true, pedigree: true },
    },
    {
      id: 2, nome: 'Luna', raca: 'Labrador Retriever', sexo: 'Fêmea',
      nascimento: '2026-03-15', preco: 3200, status: 'Disponível',
      porte: 'Grande', pelagem: 'Caramelo',
      foto: foto('photo-1561495376-dc9c7c5b8726'),
      descricao: 'Curiosa, inteligente e muito apegada às pessoas. Ótimo perfil para famílias ativas.',
      saude: { vacinas: ['V8/V10', 'Antirrábica'], vermifugado: true, microchip: true, pedigree: false },
    },
    {
      id: 3, nome: 'Mel', raca: 'Spitz Alemão', sexo: 'Fêmea',
      nascimento: '2026-04-22', preco: 4000, status: 'Reservado',
      porte: 'Pequeno', pelagem: 'Creme',
      foto: foto('photo-1558236714-d1a6333fce68'),
      descricao: 'Pequena, alerta e cheia de personalidade. Gosta de atenção e aprende rápido.',
      saude: { vacinas: ['V8/V10'], vermifugado: true, microchip: true, pedigree: true },
    },
    {
      id: 4, nome: 'Max', raca: 'Spitz Alemão', sexo: 'Macho',
      nascimento: '2025-09-10', preco: 3800, status: 'Vendido',
      porte: 'Pequeno', pelagem: 'Creme',
      foto: foto('photo-1582456780653-aabf23f711b9'),
      descricao: 'Calmo, obediente e muito companheiro. Já encontrou sua nova família.',
      saude: { vacinas: ['V8/V10', 'Antirrábica', 'Gripe canina'], vermifugado: true, microchip: true, pedigree: true },
    },
    {
      id: 5, nome: 'Nina', raca: 'Labrador Retriever', sexo: 'Fêmea',
      nascimento: '2026-02-18', preco: 3300, status: 'Disponível',
      porte: 'Grande', pelagem: 'Chocolate',
      foto: foto('photo-1529467037979-99d067b7677d'),
      descricao: 'Esperta, brincalhona e com bastante energia. Gosta de explorar e interagir.',
      saude: { vacinas: ['V8/V10', 'Antirrábica'], vermifugado: true, microchip: false, pedigree: false },
    },
    {
      id: 6, nome: 'Luke', raca: 'Spitz Alemão', sexo: 'Macho',
      nascimento: '2026-05-25', preco: 4200, status: 'Disponível',
      porte: 'Pequeno', pelagem: 'Laranja',
      foto: foto('photo-1627290991293-77c2ffefd8ac'),
      descricao: 'Alegre, ativo e muito sociável. Um cão pequeno com bastante presença.',
      saude: { vacinas: ['V8/V10'], vermifugado: true, microchip: false, pedigree: true },
    },
  ];

  // Os interessados de exemplo são criados com datas relativas a "agora",
  // para a lista sempre parecer recente na apresentação.
  function interessadosExemplo() {
    const horasAtras = (h) => new Date(Date.now() - h * 3600 * 1000).toISOString();
    return [
      { id: 1, nome: 'Mariana Alves', telefone: '(16) 98811-2233', filhoteId: 1, filhoteNome: 'Thor', mensagem: 'Gostaria de saber mais sobre disponibilidade.', criadoEm: horasAtras(2), atendido: false },
      { id: 2, nome: 'Rafael Costa', telefone: '(16) 99702-4455', filhoteId: 2, filhoteNome: 'Luna', mensagem: 'Ela se adapta bem com crianças pequenas?', criadoEm: horasAtras(5), atendido: false },
      { id: 3, nome: 'Camila Nunes', telefone: '(11) 98123-6677', filhoteId: 6, filhoteNome: 'Luke', mensagem: '', criadoEm: horasAtras(20), atendido: true },
      { id: 4, nome: 'André Lima', telefone: '(16) 99345-8899', filhoteId: null, filhoteNome: null, mensagem: 'Quero agendar uma conversa para conhecer os filhotes.', criadoEm: horasAtras(30), atendido: false },
    ];
  }

  /* ------------------------------------------------------------------------
     Utilitários internos
     ------------------------------------------------------------------------ */
  class ErroApi extends Error {
    constructor(mensagem, status) {
      super(mensagem);
      this.status = status;
    }
  }

  // Lê/grava no armazenamento do navegador sem quebrar o site se ele
  // estiver bloqueado (aba anônima, configurações de privacidade etc.).
  function ler(armazenamento, chave, padrao) {
    try {
      const valor = armazenamento.getItem(chave);
      return valor ? JSON.parse(valor) : padrao;
    } catch {
      return padrao;
    }
  }

  function gravar(armazenamento, chave, valor) {
    try {
      armazenamento.setItem(chave, JSON.stringify(valor));
    } catch {
      /* sem armazenamento disponível: os dados ficam só na memória */
    }
  }

  function remover(armazenamento, chave) {
    try {
      armazenamento.removeItem(chave);
    } catch {
      /* ignora */
    }
  }

  // Simula o tempo de resposta de um servidor no modo demonstração,
  // para os estados de "carregando" aparecerem como aparecerão de verdade.
  const esperar = (ms = 150) => new Promise((resolver) => setTimeout(resolver, ms));

  const copiar = (obj) => JSON.parse(JSON.stringify(obj));

  function proximoId(lista) {
    return lista.reduce((maior, item) => Math.max(maior, item.id), 0) + 1;
  }

  /* ------------------------------------------------------------------------
     Modo back-end: requisição genérica com fetch
     ------------------------------------------------------------------------ */
  async function requisicao(metodo, caminho, corpo) {
    const cabecalhos = { 'Content-Type': 'application/json' };
    const sessao = ler(sessionStorage, CHAVES.sessao, null);
    if (sessao && sessao.token) cabecalhos.Authorization = `Bearer ${sessao.token}`;

    let resposta;
    try {
      resposta = await fetch(API_URL + caminho, {
        method: metodo,
        headers: cabecalhos,
        body: corpo ? JSON.stringify(corpo) : undefined,
      });
    } catch {
      throw new ErroApi('Não foi possível conectar ao servidor.', 0);
    }

    // 401 fora do login = token vencido ou inválido
    if (resposta.status === 401 && caminho !== '/login') {
      remover(sessionStorage, CHAVES.sessao);
      throw new ErroApi('Sua sessão expirou. Entre novamente.', 401);
    }

    if (!resposta.ok) {
      let mensagem = caminho === '/login' ? 'E-mail ou senha incorretos.' : `Erro ${resposta.status} no servidor.`;
      try {
        const dados = await resposta.json();
        if (dados && dados.mensagem) mensagem = dados.mensagem;
      } catch {
        /* resposta sem JSON */
      }
      throw new ErroApi(mensagem, resposta.status);
    }

    return resposta.status === 204 ? null : resposta.json();
  }

  /* ------------------------------------------------------------------------
     Modo demonstração: "banco de dados" no localStorage
     ------------------------------------------------------------------------ */
  function filhotesDemo() {
    const salvos = ler(localStorage, CHAVES.filhotes, null);
    return Array.isArray(salvos) ? salvos : copiar(FILHOTES_EXEMPLO);
  }

  function interessadosDemo() {
    const salvos = ler(localStorage, CHAVES.interessados, null);
    return Array.isArray(salvos) ? salvos : interessadosExemplo();
  }

  function exigirLoginDemo() {
    if (!ler(sessionStorage, CHAVES.sessao, null)) {
      throw new ErroApi('Sua sessão expirou. Entre novamente.', 401);
    }
  }

  /* ========================================================================
     FUNÇÕES PÚBLICAS
     ======================================================================== */

  // ---------- Filhotes ----------

  // GET /filhotes
  async function listarFilhotes() {
    if (!MODO_DEMO) return requisicao('GET', '/filhotes');
    await esperar();
    return filhotesDemo();
  }

  // POST /filhotes (novo) ou PUT /filhotes/:id (edição) — exige login
  // filhote.preco é um número (ex.: 3499.9) ou null quando for "Consultar"
  async function salvarFilhote(filhote) {
    if (!MODO_DEMO) {
      return filhote.id
        ? requisicao('PUT', `/filhotes/${filhote.id}`, filhote)
        : requisicao('POST', '/filhotes', filhote);
    }
    await esperar();
    exigirLoginDemo();
    const lista = filhotesDemo();
    let salvo;
    if (filhote.id) {
      salvo = { ...filhote };
      const indice = lista.findIndex((f) => f.id === filhote.id);
      if (indice === -1) throw new ErroApi('Filhote não encontrado.', 404);
      lista[indice] = salvo;
    } else {
      salvo = { ...filhote, id: proximoId(lista) };
      lista.unshift(salvo);
    }
    gravar(localStorage, CHAVES.filhotes, lista);
    return copiar(salvo);
  }

  // DELETE /filhotes/:id — exige login
  async function excluirFilhote(id) {
    if (!MODO_DEMO) return requisicao('DELETE', `/filhotes/${id}`);
    await esperar();
    exigirLoginDemo();
    gravar(localStorage, CHAVES.filhotes, filhotesDemo().filter((f) => f.id !== id));
    return null;
  }

  // ---------- Interessados ----------

  // POST /interessados — público (o cliente preenche no site)
  async function registrarInteresse({ nome, telefone, filhoteId, mensagem }) {
    if (!MODO_DEMO) return requisicao('POST', '/interessados', { nome, telefone, filhoteId, mensagem });
    await esperar();
    const filhote = filhotesDemo().find((f) => f.id === filhoteId);
    const lista = interessadosDemo();
    const novo = {
      id: proximoId(lista),
      nome,
      telefone,
      filhoteId: filhote ? filhote.id : null,
      filhoteNome: filhote ? filhote.nome : null,
      mensagem: mensagem || '',
      criadoEm: new Date().toISOString(),
      atendido: false,
    };
    lista.unshift(novo);
    gravar(localStorage, CHAVES.interessados, lista);
    return copiar(novo);
  }

  // GET /interessados — exige login
  async function listarInteressados() {
    if (!MODO_DEMO) return requisicao('GET', '/interessados');
    await esperar();
    exigirLoginDemo();
    return interessadosDemo();
  }

  // PATCH /interessados/:id — exige login
  async function marcarAtendido(id, atendido) {
    if (!MODO_DEMO) return requisicao('PATCH', `/interessados/${id}`, { atendido });
    await esperar();
    exigirLoginDemo();
    const lista = interessadosDemo();
    const item = lista.find((i) => i.id === id);
    if (!item) throw new ErroApi('Contato não encontrado.', 404);
    item.atendido = atendido;
    gravar(localStorage, CHAVES.interessados, lista);
    return copiar(item);
  }

  // ---------- Login ----------

  // POST /login  →  { token, nome }
  async function entrar(email, senha) {
    let sessao;
    if (!MODO_DEMO) {
      sessao = await requisicao('POST', '/login', { email, senha });
    } else {
      await esperar(300);
      const confere = email.trim().toLowerCase() === LOGIN_DEMO.email && senha === LOGIN_DEMO.senha;
      if (!confere) throw new ErroApi('E-mail ou senha incorretos.', 401);
      sessao = { token: 'demo', nome: LOGIN_DEMO.nome };
    }
    gravar(sessionStorage, CHAVES.sessao, sessao);
    return sessao;
  }

  function sair() {
    remover(sessionStorage, CHAVES.sessao);
  }

  // Retorna { token, nome } se houver alguém logado nesta aba, ou null.
  function sessaoAtual() {
    return ler(sessionStorage, CHAVES.sessao, null);
  }

  // ---------- Só no modo demonstração ----------

  function restaurarDemonstracao() {
    remover(localStorage, CHAVES.filhotes);
    remover(localStorage, CHAVES.interessados);
  }

  return {
    MODO_DEMO,
    LOGIN_DEMO: MODO_DEMO ? { email: LOGIN_DEMO.email, senha: LOGIN_DEMO.senha } : null,
    listarFilhotes,
    salvarFilhote,
    excluirFilhote,
    registrarInteresse,
    listarInteressados,
    marcarAtendido,
    entrar,
    sair,
    sessaoAtual,
    restaurarDemonstracao,
  };
})();
