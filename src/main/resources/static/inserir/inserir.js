document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    // Pegando os elementos de estatística do seu HTML
    const totalPalavrasElement = document.getElementById('total-palavras');
    const nosArvoreElement = document.getElementById('nos-arvore');

    // 1. Função para carregar o contador atualizado do Java
    async function carregarEstatisticas() {
        try {
            // Rota exata do seu GetMapping no Controller
            const resposta = await fetch('http://localhost:8080/api/dicionario/contador');
            const total = await resposta.json();
            
            if (totalPalavrasElement) totalPalavrasElement.innerText = total;
            if (nosArvoreElement) nosArvoreElement.innerText = total;
        } catch (erro) {
            console.error("Erro ao buscar contador:", erro);
        }
    }

    // 2. Evento de envio do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const tupiValue = document.getElementById('tupi').value;
        const portuguesValue = document.getElementById('portugues').value;

        // IMPORTANTE: Verifique se no seu arquivo Palavra.java 
        // os nomes são 'palavra' e 'significado'. Se forem diferentes, mude aqui:
        const novaPalavra = {
            palavra: tupiValue,
            significado: portuguesValue
        };

        try {
            // Rota exata do seu PostMapping no Controller
            const response = await fetch('http://localhost:8080/api/dicionario/inserir', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novaPalavra)
            });

            if (response.ok) {
                alert('Sucesso! O Java inseriu e balanceou a árvore AVL.');
                form.reset(); 
                carregarEstatisticas(); // Atualiza os números na tela
            } else {
                alert('Erro ao inserir. Verifique se o servidor Java está rodando.');
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
            alert('Não foi possível conectar ao servidor Spring Boot.');
        }
    });

    // Inicia os contadores ao abrir a página
    carregarEstatisticas();
});