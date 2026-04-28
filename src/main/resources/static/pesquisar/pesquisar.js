document.addEventListener('DOMContentLoaded', () => {
    const formPesquisa = document.getElementById('formulario-pesquisa');
    const campoTupi = document.getElementById('campo-tupi');
    
    // Criar o container de resultado dinamicamente se ele não existir
    const mainContainer = document.querySelector('main');
    const resultadoContainer = document.createElement('div');
    resultadoContainer.id = 'resultado-pesquisa';
    resultadoContainer.className = 'd-flex justify-content-center mt-4';
    // Insere o container de resultado antes do informativo
    const informativo = document.querySelector('.cartao-informativo-busca').parentElement;
    mainContainer.insertBefore(resultadoContainer, informativo);

    // 1. Função para buscar a palavra no Java
    async function buscarPalavra(termo) {
        if (!termo) return;

        try {
            // Chamada para a Controller Java (note o /pesquisar/{termo})
            const resposta = await fetch(`http://localhost:8080/api/dicionario/pesquisar/${termo}`);

            if (resposta.ok) {
                const palavraEncontrada = await resposta.json();
                exibirResultado(palavraEncontrada);
            } else if (resposta.status === 404) {
                exibirErro("Palavra não encontrada no dicionário.");
            } else {
                exibirErro("Erro ao processar a busca.");
            }
        } catch (erro) {
            console.error("Erro de conexão:", erro);
            exibirErro("Não foi possível conectar ao servidor Spring Boot.");
        }
    }

    // 2. Função para mostrar o card de resultado na tela
    function exibirResultado(p) {
        resultadoContainer.innerHTML = `
            <div class="cartao-resultado p-4 w-100 animate__animated animate__fadeIn" style="max-width: 600px; background: white; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border-left: 5px solid #0d6efd;">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <span class="badge bg-primary mb-2">Resultado Encontrado</span>
                        <h2 class="fw-bold mb-1" style="color: #1a3a3a; text-transform: capitalize;">${p.palavra}</h2>
                        <p class="fs-5 text-muted mb-0">Significado: <strong>${p.significado}</strong></p>
                    </div>
                    <div class="fs-1">🌳</div>
                </div>
            </div>
        `;
    }

    // 3. Função para mostrar mensagens de erro
    function exibirErro(mensagem) {
        resultadoContainer.innerHTML = `
            <div class="alert alert-warning rounded-4 shadow-sm" role="alert">
                ⚠️ ${mensagem}
            </div>
        `;
    }

    // 4. Evento do Formulário
    formPesquisa.addEventListener('submit', (e) => {
        e.preventDefault();
        buscarPalavra(campoTupi.value.trim().toLowerCase());
    });

    // 5. Função Global para os botões de sugestão
    window.preencherBusca = (termo) => {
        campoTupi.value = termo;
        buscarPalavra(termo);
    };
});