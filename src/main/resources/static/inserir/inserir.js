document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const totalPalavrasElement = document.getElementById('total-palavras');
    const nosArvoreElement = document.getElementById('nos-arvore');

    const JAVA_API_URL = "http://localhost:3000/api/dicionario";

    async function carregarEstatisticas() {
        try {
            // Rota do Controller
            const resposta = await fetch(`${JAVA_API_URL}/contador`);
            const total = await resposta.json();
            
            if (totalPalavrasElement) totalPalavrasElement.innerText = total;
            if (nosArvoreElement) nosArvoreElement.innerText = total;
        } catch (erro) {
            console.error("Erro ao buscar contador:", erro);
        }
    }

    //Envio do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const tupiValue = document.getElementById('tupi').value;
        const portuguesValue = document.getElementById('portugues').value;

        const novaPalavra = {
            palavra: tupiValue,
            significado: portuguesValue
        };

        try {
            const response = await fetch(`${JAVA_API_URL}/inserir`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novaPalavra)
            });

            if (response.ok) {
                alert('Sucesso! O Java inseriu e balanceou a árvore AVL.');
                form.reset(); 
                carregarEstatisticas();

            } else {
                alert('Erro ao inserir. Verifique se o servidor Java está rodando.');
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
            alert('Não foi possível conectar ao servidor Spring Boot.');
        }
    });

    carregarEstatisticas();
});