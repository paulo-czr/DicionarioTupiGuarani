document.addEventListener("DOMContentLoaded", () => {
  const gradePalavras = document.getElementById("grade-palavras");
  const totalPalavrasCard = document.getElementById("total-palavras");
  const primeiraPalavraCard = document.getElementById("primeira-palavra");
  const ultimaPalavraCard = document.getElementById("ultima-palavra");

  const textoContadorPequeno = document.querySelector(
    ".icone-dicionario-wrapper + div small"
  );

  const JAVA_API_URL = "http://localhost:3000/api/dicionario";

  /**
   *  Carrega tudo do banco
   */
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
   * CArrega lista em ordem
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

      atualizarInterface(palavras);

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
    }
  }

  /**
   * att interface
   */
  function atualizarInterface(palavras) {
    gradePalavras.innerHTML = "";

    const total = palavras.length;

    if (total > 0) {
      primeiraPalavraCard.innerText = palavras[0].palavra;
      ultimaPalavraCard.innerText = palavras[total - 1].palavra;

      palavras.forEach((p) => {
        const col = document.createElement("div");
        col.className = "col-md-6";

        col.innerHTML = `
          <div class="cartao-palavra d-flex justify-content-between align-items-center shadow-sm">
            <div>
              <div class="termo-principal">${p.palavra}</div>
              <div class="traducao-termo text-muted">${p.significado}</div>
            </div>
            <button class="botao-remover-palavra"
              title="Remover"
              onclick="confirmarRemocao('${p.palavra}')">
              🗑️
            </button>
          </div>
        `;

        gradePalavras.appendChild(col);
      });

    } else {
      primeiraPalavraCard.innerText = "-";
      ultimaPalavraCard.innerText = "-";

      if (textoContadorPequeno) {
        textoContadorPequeno.innerText = "Nenhuma palavra cadastrada";
      }

      gradePalavras.innerHTML = `
        <div class="col-12 text-center py-5">
          <p class="text-muted fs-5">O dicionário está vazio.</p>
        </div>`;
    }
  }

  /**
   * remove palavra
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