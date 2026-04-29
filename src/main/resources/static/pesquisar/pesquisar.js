let buscarPalavra; 

document.addEventListener('DOMContentLoaded', () => {
    const formPesquisa = document.getElementById('formulario-pesquisa');
    const campoTupi = document.getElementById('campo-tupi');
    const mainContainer = document.querySelector('main');
    
    const resultadoContainer = document.createElement('div');
    resultadoContainer.id = 'resultado-pesquisa';
    resultadoContainer.className = 'd-flex justify-content-center mt-4';
    
    const informativo = document.querySelector('.cartao-informativo-busca').parentElement;
    mainContainer.insertBefore(resultadoContainer, informativo);

    const JAVA_API_URL = "http://localhost:3000/api/dicionario";

    buscarPalavra = async (termo) => {
        if (!termo) return;

        resultadoContainer.innerHTML = '<div class="spinner-border text-primary" role="status"></div>';

        try {
            const resposta = await fetch(`${JAVA_API_URL}/pesquisar/palavra/${encodeURIComponent(termo)}`);

            if (resposta.ok) {
                const palavraEncontrada = await resposta.json();
                exibirResultado(palavraEncontrada);
            } else if (resposta.status === 404) {
                exibirErro(`A palavra "${termo}" não foi encontrada.`);
            } else {
                exibirErro("Erro ao processar a busca no servidor.");
            }
        } catch (erro) {
            console.error("Erro de conexão:", erro);
            exibirErro("Não foi possível conectar ao servidor.");
        }
    };

    function exibirResultado(p) {
        resultadoContainer.innerHTML = `
            <div class="cartao-resultado p-4 w-100 shadow-sm" style="max-width: 600px; background: white; border-radius: 20px; border-left: 6px solid #1a3a3a;">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <span class="badge bg-success mb-2 px-3 py-2 rounded-pill">Palavra Encontrada</span>
                        <h2 class="fw-bold mb-1" style="color: #1a3a3a; font-family: 'Inter', sans-serif;">${p.palavra}</h2>
                        <hr class="my-2" style="opacity: 0.1;">
                        <p class="fs-5 mb-0" style="color: #4a4a4a;">
                            <span class="text-muted small d-block">Significado:</span>
                            <strong>${p.significado}</strong>
                        </p>
                    </div>
                </div>
            </div>`
    }

    function exibirErro(mensagem) {
        resultadoContainer.innerHTML = `
            <div class="alert alert-light border-warning d-flex align-items-center gap-3 p-4 shadow-sm" role="alert" style="max-width: 600px; border-radius: 15px; border-left: 5px solid #ffc107;">
                <span class="fs-3">⚠️</span>
                <div class="text-dark">${mensagem}</div>
            </div>`;
    }

    formPesquisa.addEventListener('submit', (e) => {
        e.preventDefault();
        buscarPalavra(campoTupi.value.trim().toLowerCase());
    });

    window.preencherBusca = (termo) => {
        campoTupi.value = termo;
        buscarPalavra(termo.toLowerCase());
        resultadoContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
});