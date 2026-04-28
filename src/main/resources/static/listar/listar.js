document.addEventListener('DOMContentLoaded', () => {
    const gradePalavras = document.getElementById('grade-palavras');
    const totalPalavrasCard = document.getElementById('total-palavras');
    const primeiraPalavraCard = document.getElementById('primeira-palavra');
    const ultimaPalavraCard = document.getElementById('ultima-palavra');
    const textoContadorPequeno = document.querySelector('.text-muted');

    // 1. Função para carregar os dados do Java
    async function carregarDados() {
        try {
            const resposta = await fetch('http://localhost:8080/api/dicionario/listar-em-ordem');
            const palavras = await resposta.json();

            atualizarInterface(palavras);
        } catch (erro) {
            console.error("Erro ao carregar dicionário:", erro);
            gradePalavras.innerHTML = '<p class="text-danger">Erro ao conectar com o servidor Java.</p>';
        }
    }

    // 2. Função para construir a interface dinamicamente
    function atualizarInterface(palavras) {
        // Limpa a grade
        gradePalavras.innerHTML = '';

        // Atualiza Estatísticas
        const total = palavras.length;
        totalPalavrasCard.innerText = total;
        if (textoContadorPequeno) textoContadorPequeno.innerText = `${total} palavras cadastradas`;

        if (total > 0) {
            primeiraPalavraCard.innerText = palavras[0].palavra;
            ultimaPalavraCard.innerText = palavras[total - 1].palavra;

            // Preenche a grade de cards
            palavras.forEach(p => {
                const col = document.createElement('div');
                col.className = 'col-md-6';
                col.innerHTML = `
                    <div class="cartao-palavra d-flex justify-content-between align-items-center">
                        <div>
                            <div class="termo-principal">${p.palavra}</div>
                            <div class="traducao-termo">${p.significado}</div>
                        </div>
                        <button class="botao-remover-palavra" title="Remover" onclick="removerPalavra('${p.palavra}')">
                            🗑️
                        </button>
                    </div>
                `;
                gradePalavras.appendChild(col);
            });
        } else {
            primeiraPalavraCard.innerText = "-";
            ultimaPalavraCard.innerText = "-";
            gradePalavras.innerHTML = '<div class="text-center w-100 p-5 text-muted">Dicionário vazio.</div>';
        }
    }

    // 3. Função para remover (Exposta globalmente para o onclick)
    window.removerPalavra = async (termo) => {
        if (confirm(`Tem certeza que deseja remover "${termo}"?`)) {
            try {
                const response = await fetch(`http://localhost:8080/api/dicionario/remover/${termo}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    // Recarrega a lista após o Java rebalancear a árvore
                    carregarDados();
                } else {
                    alert("Erro ao remover a palavra.");
                }
            } catch (erro) {
                console.error("Erro na requisição de remoção:", erro);
            }
        }
    };

    // Inicializa a página
    carregarDados();
});