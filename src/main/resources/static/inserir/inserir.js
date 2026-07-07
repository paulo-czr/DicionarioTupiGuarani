document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const totalPalavrasElement = document.getElementById('total-palavras');
    const nosArvoreElement = document.getElementById('nos-arvore');
    const mensagemElement = document.getElementById('mensagem-feedback');

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

    function exibirMensagem(texto, tipo) {
        if (!mensagemElement) return;
        mensagemElement.innerText = texto;
        
        // Define as classes do Bootstrap
        mensagemElement.className = `alert alert-${tipo} text-center fw-bold border-0 shadow-sm mb-4`;

        setTimeout(() => {
            mensagemElement.className = 'd-none';
            mensagemElement.innerText = '';
        }, 4000);
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

            if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); 
            throw new Error(errorData.message || `Erro no servidor (Status ${response.status})`);
            }

            exibirMensagem('Sucesso! O Java inseriu e balanceou a árvore AVL.', 'success');
            form.reset(); 
            carregarEstatisticas();

        } catch (error) {
            console.error('Erro na requisição:', error);
            
            const textoErro = error.message === 'Failed to fetch' 
                ? 'Não foi possível conectar ao servidor Spring Boot.' 
                : error.message;

            exibirMensagem(textoErro, 'danger');
        }
    });

    carregarEstatisticas();
});