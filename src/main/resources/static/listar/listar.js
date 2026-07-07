document.addEventListener("DOMContentLoaded", () => {
  const gradePalavras = document.getElementById("grade-palavras");
  const totalPalavrasCard = document.getElementById("total-palavras");
  const primeiraPalavraCard = document.getElementById("primeira-palavra");
  const ultimaPalavraCard = document.getElementById("ultima-palavra");
  const paginacaoContainer = document.getElementById("paginacao-container");
  const campoBusca = document.getElementById("campo-busca");
  const botaoLimparBusca = document.getElementById("botao-limpar-busca");
  const contadorResultadosBusca = document.getElementById("contador-resultados-busca");

  const textoContadorPequeno = document.querySelector(
    ".icone-dicionario-wrapper + div small"
  );

  const JAVA_API_URL = "http://localhost:3000/api/dicionario";
  const ITENS_POR_PAGINA = 8;

  // Estado da tela
  let todasPalavras = [];
  let termoBusca = "";
  let paginaAtual = 1;

  async function carregarTotalPalavras() {
    try {
      const resposta = await fetch(`${JAVA_API_URL}/contador`);

      if (!resposta.ok) {
        throw new Error("Erro ao buscar contador");
      }

      const total = await resposta.json();

      totalPalavrasCard.innerText = total;

      if (textoContadorPequeno) {
        textoContadorPequeno.innerText = `${total} palavras cadastradas`;
      }

    } catch (erro) {
      console.error("Erro ao carregar total:", erro);
      totalPalavrasCard.innerText = "Erro";
    }
  }

  /**
   * Carrega lista em ordem a partir da API
   */
  async function carregarDados() {
    try {
      gradePalavras.innerHTML = `
        <div class="text-center w-100 p-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2 text-muted">Carregando dicionário...</p>
        </div>`;

      const resposta = await fetch(`${JAVA_API_URL}/listar-em-ordem`);

      if (!resposta.ok) {
        throw new Error("Erro na resposta do servidor");
      }

      const palavras = await resposta.json();

      todasPalavras = palavras;
      paginaAtual = 1;

      atualizarCardsResumo(palavras);
      renderizarPagina();
      carregarTotalPalavras();

    } catch (erro) {
      console.error("Erro ao carregar dicionário:", erro);

      gradePalavras.innerHTML = `
        <div class="col-12 text-center p-5">
          <div class="alert alert-danger shadow-sm">
            Não foi possível conectar ao servidor Java. <br>
            <small>Verifique se o backend está rodando em ${JAVA_API_URL}</small>
          </div>
        </div>`;
      paginacaoContainer.innerHTML = "";
    }
  }

  /**
   * Atualiza os cards de Primeira/Última palavra com base na lista completa
   * (não é afetado pela busca, sempre reflete o dicionário inteiro)
   */
  function atualizarCardsResumo(palavras) {
    const total = palavras.length;

    if (total > 0) {
      primeiraPalavraCard.innerText = palavras[0].palavra;
      ultimaPalavraCard.innerText = palavras[total - 1].palavra;
    } else {
      primeiraPalavraCard.innerText = "-";
      ultimaPalavraCard.innerText = "-";

      if (textoContadorPequeno) {
        textoContadorPequeno.innerText = "Nenhuma palavra cadastrada";
      }
    }
  }

  /**
   * Retorna a lista filtrada pelo termo de busca (palavra ou significado)
   */
  function obterPalavrasFiltradas() {
    if (!termoBusca) return todasPalavras;

    const termo = termoBusca.toLowerCase();

    return todasPalavras.filter((p) =>
      p.palavra.toLowerCase().includes(termo) ||
      p.significado.toLowerCase().includes(termo)
    );
  }

  /**
   * Renderiza a grade de palavras para a página atual, considerando o filtro de busca
   */
  function renderizarPagina() {
    const filtradas = obterPalavrasFiltradas();

    // Feedback do resultado da busca
    if (termoBusca) {
      contadorResultadosBusca.style.display = "block";
      contadorResultadosBusca.innerText = filtradas.length === 1
        ? `1 palavra encontrada`
        : `${filtradas.length} palavras encontradas`;
    } else {
      contadorResultadosBusca.style.display = "none";
    }

    const totalPaginas = Math.max(1, Math.ceil(filtradas.length / ITENS_POR_PAGINA));
    if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const itensDaPagina = filtradas.slice(inicio, inicio + ITENS_POR_PAGINA);

    gradePalavras.innerHTML = "";

    if (filtradas.length === 0) {
      gradePalavras.innerHTML = `
        <div class="col-12 text-center py-5">
          <p class="text-muted fs-5">
            ${termoBusca ? `Nenhuma palavra encontrada para "${termoBusca}".` : "O dicionário está vazio."}
          </p>
        </div>`;
      paginacaoContainer.innerHTML = "";
      return;
    }

    itensDaPagina.forEach((p) => {
      const col = document.createElement("div");
      col.className = "col-md-6";

      col.innerHTML = `
        <div class="cartao-palavra d-flex justify-content-between align-items-center shadow-sm">
          <div>
            <div class="termo-principal">${p.palavra}</div>
            <div class="traducao-termo text-muted">${p.significado}</div>
          </div>
          <button class="botao-remover-palavra p-3"
            title="Remover"
            onclick="confirmarRemocao('${p.palavra}')">
              <i class="bi bi-trash"></i>
          </button>
        </div>
      `;

      gradePalavras.appendChild(col);
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
        gradePalavras.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
        paginacaoContainer.appendChild(
          criarBotao(String(item), item, { ativo: item === paginaAtual })
        );
      }
    });

    paginacaoContainer.appendChild(
      criarBotao('<i class="bi bi-chevron-right"></i>', paginaAtual + 1, { desabilitado: paginaAtual === totalPaginas })
    );
  }

  // Busca em tempo real
  campoBusca.addEventListener("input", (e) => {
    termoBusca = e.target.value.trim();
    botaoLimparBusca.style.display = termoBusca ? "flex" : "none";
    paginaAtual = 1;
    renderizarPagina();
  });

  botaoLimparBusca.addEventListener("click", () => {
    termoBusca = "";
    campoBusca.value = "";
    botaoLimparBusca.style.display = "none";
    paginaAtual = 1;
    renderizarPagina();
    campoBusca.focus();
  });

  /**
   * Remove palavra
   */
  window.confirmarRemocao = async (termo) => {
    if (
      confirm(`Deseja realmente excluir a palavra "${termo}"?`)
    ) {
      try {
        const response = await fetch(
          `${JAVA_API_URL}/remover/palavra/${encodeURIComponent(termo)}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          carregarDados();
        } else {
          const erroMsg = await response.text();
          alert("Erro ao remover: " + erroMsg);
        }

      } catch (erro) {
        console.error("Erro na remoção:", erro);
        alert("Falha ao conectar com o servidor.");
      }
    }
  };

  carregarDados();
});
