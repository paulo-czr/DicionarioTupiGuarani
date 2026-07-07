document.addEventListener("DOMContentLoaded", () => {

  const API_BASE_URL = "http://localhost:3000/api/dicionario";
  const ITENS_POR_PAGINA = 6;

  // Mapeamento de cada tipo de travessia para o endpoint do backend
  const tiposTravessia = {
    "Pré-ordem": "listar-pre-ordem",
    "Em Ordem": "listar-em-ordem",
    "Pós-ordem": "listar-pos-ordem",
    "Profundidade (DFS)": "listar-pre-ordem",
    "Amplitude (BFS)": "listar-amplitude",
  };

  // Mapeamento de cada tipo para sua identidade visual (classes já definidas no CSS)
  const estiloTipo = {
    "Pré-ordem": { classe: "tipo-preordem", icone: "bi-diagram-3", fundo: "fundo-preordem" },
    "Em Ordem": { classe: "tipo-emordem", icone: "bi-list-ul", fundo: "fundo-emordem" },
    "Pós-ordem": { classe: "tipo-posordem", icone: "bi-arrow-down", fundo: "fundo-posordem" },
    "Profundidade (DFS)": { classe: "tipo-dfs", icone: "bi-layers", fundo: "fundo-dfs" },
    "Amplitude (BFS)": { classe: "tipo-bfs", icone: "bi-layers-half", fundo: "fundo-bfs" },
  };

  const listaContainer = document.getElementById("lista-travessia");
  const paginacaoContainer = document.getElementById("paginacao-travessias");
  const botoes = document.querySelectorAll("#seletor-travessias button");

  // Estado da tela
  let todosItens = [];
  let tipoAtual = "Em Ordem";
  let paginaAtual = 1;

  function inicializarEventos() {
    botoes.forEach((botao) => {
      botao.addEventListener("click", () => {
        const tipoSelecionado = botao.dataset.tipo;
        if (!tipoSelecionado || tipoSelecionado === tipoAtual) return;

        atualizarBotaoAtivo(botao);
        tipoAtual = tipoSelecionado;
        paginaAtual = 1;
        buscarDadosTravessia(tipoSelecionado);
      });
    });
  }

  function atualizarBotaoAtivo(botaoClicado) {
    botoes.forEach((btn) => btn.classList.remove("ativo"));
    botaoClicado.classList.add("ativo");
  }

  async function buscarDadosTravessia(tipo) {
    const endpoint = tiposTravessia[tipo];
    if (!endpoint) return;

    listaContainer.innerHTML = `
      <div class="text-center p-5">
        <div class="spinner-border" role="status" style="color: var(--verde-mata);"></div>
      </div>`;
    paginacaoContainer.innerHTML = "";

    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`);
      if (!response.ok) throw new Error("Erro ao buscar dados do servidor");

      const dados = await response.json();

      todosItens = dados || [];
      atualizarTextoExplicativo(tipo);
      renderizarPagina();
    } catch (error) {
      console.error("Erro:", error);
      listaContainer.innerHTML = `
        <div class="alert alert-danger rounded-4">
          Não foi possível conectar ao backend Java. Verifique se o endpoint
          <strong>/${endpoint}</strong> está disponível em ${API_BASE_URL}.
        </div>`;
    }
  }

  /**
   * Renderiza os itens da página atual, respeitando a ordem original da travessia
   */
  function renderizarPagina() {
    if (!todosItens || todosItens.length === 0) {
      listaContainer.innerHTML = `<p class="text-center text-muted py-4">A árvore está vazia no momento.</p>`;
      paginacaoContainer.innerHTML = "";
      return;
    }

    const totalPaginas = Math.max(1, Math.ceil(todosItens.length / ITENS_POR_PAGINA));
    if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const itensDaPagina = todosItens.slice(inicio, inicio + ITENS_POR_PAGINA);

    listaContainer.innerHTML = "";

    itensDaPagina.forEach((item, index) => {
      const posicao = inicio + index + 1;
      const itemHtml = `
        <div class="item-travessia">
          <div class="badge-numero">${posicao}</div>
          <div class="flex-grow-1">
            <span class="item-palavra">${item.palavra}</span>
            <span class="item-seta">→</span>
            <span class="item-significado">${item.significado}</span>
          </div>
        </div>`;
      listaContainer.insertAdjacentHTML("beforeend", itemHtml);
    });

    renderizarPaginacao(totalPaginas);
  }

  /**
   * Calcula quais números exibir na paginação, inserindo "..." nos intervalos ignorados.
   * Ex: página atual 5 de 54 -> [1, '...', 4, 5, 6, '...', 54]
   */
  function calcularIntervaloPaginas(paginaAtual, totalPaginas, delta = 1) {
    const paginasVisiveis = [];

    for (let i = 1; i <= totalPaginas; i++) {
      const ehExtremidade = i === 1 || i === totalPaginas;
      const ehVizinha = i >= paginaAtual - delta && i <= paginaAtual + delta;
      if (ehExtremidade || ehVizinha) {
        paginasVisiveis.push(i);
      }
    }

    const resultado = [];
    let ultimaAdicionada = null;

    paginasVisiveis.forEach((pagina) => {
      if (ultimaAdicionada !== null) {
        const salto = pagina - ultimaAdicionada;
        if (salto === 2) {
          resultado.push(ultimaAdicionada + 1);
        } else if (salto > 2) {
          resultado.push("...");
        }
      }
      resultado.push(pagina);
      ultimaAdicionada = pagina;
    });

    return resultado;
  }

  /**
   * Monta os botões de paginação com reticências (1 ... 4 5 6 ... 54)
   */
  function renderizarPaginacao(totalPaginas) {
    paginacaoContainer.innerHTML = "";

    if (totalPaginas <= 1) return;

    const criarBotao = (conteudo, pagina, opcoes = {}) => {
      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = "botao-pagina" + (opcoes.ativo ? " ativo" : "");
      botao.innerHTML = conteudo;
      botao.disabled = !!opcoes.desabilitado;
      botao.addEventListener("click", () => {
        paginaAtual = pagina;
        renderizarPagina();
        listaContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
      return botao;
    };

    const criarPontos = () => {
      const span = document.createElement("span");
      span.className = "pontos-pagina";
      span.innerText = "...";
      return span;
    };

    paginacaoContainer.appendChild(
      criarBotao('<i class="bi bi-chevron-left"></i>', paginaAtual - 1, { desabilitado: paginaAtual === 1 })
    );

    const intervalo = calcularIntervaloPaginas(paginaAtual, totalPaginas);
    intervalo.forEach((item) => {
      if (item === "...") {
        paginacaoContainer.appendChild(criarPontos());
      } else {
        paginacaoContainer.appendChild(criarBotao(String(item), item, { ativo: item === paginaAtual }));
      }
    });

    paginacaoContainer.appendChild(
      criarBotao('<i class="bi bi-chevron-right"></i>', paginaAtual + 1, { desabilitado: paginaAtual === totalPaginas })
    );
  }

  /**
   * Atualiza o card de explicação (título, texto e identidade visual) conforme o tipo selecionado
   */
  function atualizarTextoExplicativo(tipo) {
    const alerta = document.getElementById("alerta-explicativo");
    const icone = document.getElementById("icone-alerta");
    const titulo = document.getElementById("titulo-alerta");
    const legenda = document.getElementById("legenda-alerta");

    const estilo = estiloTipo[tipo];
    if (estilo && alerta && icone) {
      alerta.className = `alerta-explicativo ${estilo.classe} mb-4`;
      icone.className = `caixa-icone-tipo ${estilo.fundo}`;
      icone.innerHTML = `<i class="bi ${estilo.icone}"></i>`;
    }

    if (titulo) titulo.innerText = tipo;
    if (!legenda) return;

    switch (tipo) {
      case "Pré-ordem":
        legenda.innerText = "Raiz → Esquerda → Direita (Exploração de cima para baixo).";
        break;
      case "Em Ordem":
        legenda.innerText = "Esquerda → Raiz → Direita (Garante a ordem alfabética).";
        break;
      case "Pós-ordem":
        legenda.innerText = "Esquerda → Direita → Raiz (Processa os filhos antes do pai).";
        break;
      case "Profundidade (DFS)":
        legenda.innerText = "Explora o máximo possível cada ramo antes de retroceder.";
        break;
      case "Amplitude (BFS)":
        legenda.innerText = "Percorre a árvore nível por nível (horizontalmente), da esquerda para a direita.";
        break;
    }
  }

  inicializarEventos();
  buscarDadosTravessia(tipoAtual);
});
