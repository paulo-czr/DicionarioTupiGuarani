class DicionarioApp {
  constructor() {
    this.API_URL = "http://localhost:3000/api/dicionario";

    // Interface
    this.form = document.querySelector("form");
    this.inputTupi = document.getElementById("tupi");
    this.inputSignificado = document.getElementById("portugues");
    this.displayContador = document.getElementById("contador-palavras");

    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => this.salvar(e));
    }
    this.atualizarEstatisticas();
  }

  /**
   * POST: Envia a palavra para o Java salvar no MySQL e na AVL
   */
  async salvar(e) {
    e.preventDefault();
    
    const novaPalavra = {
      palavra: this.inputTupi.value,
      significado: this.inputSignificado.value,
    };

    try {
      const response = await fetch(`${this.API_URL}/inserir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaPalavra),
      });

      if (response.ok) {
        alert("✅ Palavra inserida e Árvore AVL balanceada!");
        this.form.reset();
        this.atualizarEstatisticas();
      } else {
        alert("❌ Erro ao salvar palavra.");
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      alert("Não foi possível conectar ao servidor Java na porta 3000.");
    }
  }

  /**
   * GET: Busca o tamanho da árvore no Java
   */
  async atualizarEstatisticas() {
    try {
      const response = await fetch(`${this.API_URL}/contador`);
      const total = await response.json();

      if (this.displayContador) {
        this.displayContador.innerText = total;
      }
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  }
}

// Inicializa o sistema
document.addEventListener("DOMContentLoaded", () => {
  new DicionarioApp();
});
