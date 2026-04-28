const API_BASE_URL = 'http://localhost:8080/api/dicionario';

// Função para carregar os dados e atualizar a tela
async function carregarDados() {
    try {
        // 1. Busca a lista de palavras (Em Ordem)
        const response = await fetch(`${API_BASE_URL}/listar-em-ordem`);
        const palavras = await response.json();

        renderizarLista(palavras);
        atualizarEstatisticas(palavras);
    } catch (error) {
        console.error("Erro ao carregar dicionário:", error);
    }
}

// Função para desenhar os cartões no HTML
function renderizarLista(palavras) {
    const container = document.getElementById('lista-palavras-container');
    container.innerHTML = ''; // Limpa a lista atual

    palavras.forEach(p => {
        const cartao = `
            <div class="col-md-6">
                <div class="cartao-palavra d-flex justify-content-between align-items-center">
                    <div class="conteudo-palavra">
                        <h5 class="termo-principal">${p.palavra}</h5>
                        <p class="traducao-termo mb-0">${p.significado}</p>
                    </div>
                    <button class="botao-remover-palavra" onclick="removerPalavra('${p.palavra}')" title="Remover palavra">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += cartao;
    });
}

// Função para deletar no Java
async function removerPalavra(termo) {
    if (confirm(`Tem certeza que deseja remover "${termo}"?`)) {
        try {
            const response = await fetch(`${API_BASE_URL}/remover/${termo}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Recarrega a lista após deletar
                carregarDados();
            } else {
                alert("Erro ao remover a palavra.");
            }
        } catch (error) {
            console.error("Erro na requisição de remoção:", error);
        }
    }
}

// Atualiza os cartões de estatística (Top da página)
function atualizarEstatisticas(palavras) {
    document.getElementById('contador-total').innerText = palavras.length;
    document.getElementById('contador-lista').innerText = palavras.length;
    
    if (palavras.length > 0) {
        document.getElementById('primeira-palavra').innerText = palavras[0].palavra;
        document.getElementById('ultima-palavra').innerText = palavras[palavras.length - 1].palavra;
    } else {
        document.getElementById('primeira-palavra').innerText = "-";
        document.getElementById('ultima-palavra').innerText = "-";
    }
}

// Inicializa
document.addEventListener('DOMContentLoaded', carregarDados);