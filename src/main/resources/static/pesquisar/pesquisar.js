let buscarPalavra; 

document.addEventListener('DOMContentLoaded', () => {
    const formPesquisa = document.getElementById('formulario-pesquisa');
    const campoTupi = document.getElementById('campo-tupi');
    const mainContainer = document.querySelector('main');
    const dropdownSugestoes = document.getElementById('sugestoes-dropdown');
    
    const resultadoContainer = document.createElement('div');
    resultadoContainer.id = 'resultado-pesquisa';
    resultadoContainer.className = 'd-flex justify-content-center mt-4';
    
    const informativo = document.querySelector('.cartao-informativo-busca').parentElement;
    mainContainer.insertBefore(resultadoContainer, informativo);

    const JAVA_API_URL = "http://localhost:3000/api/dicionario";
    const ITENS_POR_PAGINA_SUGESTAO = 6;

    // Estado do autocomplete
    let todasPalavrasSugestao = null; // null = ainda não carregado
    let paginaSugestao = 1;

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
            <div class="cartao-resultado p-4 w-100 shadow-sm" style="max-width: 600px; background: white; border-radius: 20px;">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <span class="badge badge-sucesso-pesquisa mb-2 px-3 py-2 rounded-pill">Palavra Encontrada</span>
                        <h2 class="fw-bold mb-1" style="color: #2F5233; font-family: 'Inter', sans-serif;">${p.palavra}</h2>
                        <hr class="my-2" style="opacity: 0.1;">
                        <p class="fs-5 mb-0" style="color: #4A3728;">
                            <span class="text-muted small d-block">Significado:</span>
                            <strong>${p.significado}</strong>
                        </p>
                    </div>
                </div>
            </div>`
    }

    function exibirErro(mensagem) {
        resultadoContainer.innerHTML = `
            <div class="alert alert-light alerta-nao-encontrado d-flex align-items-center gap-3 p-4 shadow-sm" role="alert" style="max-width: 600px; border-radius: 15px;">
                <span class="fs-3">⚠️</span>
                <div class="text-dark">${mensagem}</div>
            </div>`;
    }

    /* AUTOCOMPLETE / SUGESTÕES COM PAGINAÇÃO */

    async function carregarPalavrasSugestao() {
        if (todasPalavrasSugestao !== null) return; // já carregado, usa cache

        dropdownSugestoes.innerHTML = `<div class="sugestoes-mensagem">Carregando palavras...</div>`;
        dropdownSugestoes.classList.add('aberto');

        try {
            const resposta = await fetch(`${JAVA_API_URL}/listar-em-ordem`);
            if (!resposta.ok) throw new Error("Erro ao buscar palavras");
            todasPalavrasSugestao = await resposta.json();
        } catch (erro) {
            console.error("Erro ao carregar sugestões:", erro);
            todasPalavrasSugestao = [];
            dropdownSugestoes.innerHTML = `<div class="sugestoes-mensagem">Não foi possível carregar as sugestões.</div>`;
            return;
        }

        renderizarSugestoes();
    }

    function obterSugestoesFiltradas() {
        const termo = campoTupi.value.trim().toLowerCase();
        if (!termo) return todasPalavrasSugestao || [];

        return (todasPalavrasSugestao || []).filter((p) =>
            p.palavra.toLowerCase().includes(termo) ||
            p.significado.toLowerCase().includes(termo)
        );
    }

    function renderizarSugestoes() {
        const filtradas = obterSugestoesFiltradas();

        if (filtradas.length === 0) {
            dropdownSugestoes.innerHTML = `
                <div class="sugestoes-mensagem">Nenhuma palavra encontrada.</div>`;
            return;
        }

        const totalPaginas = Math.max(1, Math.ceil(filtradas.length / ITENS_POR_PAGINA_SUGESTAO));
        if (paginaSugestao > totalPaginas) paginaSugestao = totalPaginas;

        const inicio = (paginaSugestao - 1) * ITENS_POR_PAGINA_SUGESTAO;
        const itensDaPagina = filtradas.slice(inicio, inicio + ITENS_POR_PAGINA_SUGESTAO);

        const listaHtml = itensDaPagina.map((p) => `
            <div class="item-sugestao" data-palavra="${p.palavra}">
                <span class="palavra-sugerida">${p.palavra}</span>
                <span class="significado-sugerido">${p.significado}</span>
            </div>
        `).join('');

        const paginacaoHtml = totalPaginas > 1 ? `
            <div class="sugestoes-paginacao">
                <button type="button" class="botao-pagina-sugestao" data-acao="anterior" ${paginaSugestao === 1 ? 'disabled' : ''}>
                    <i class="bi bi-chevron-left"></i>
                </button>
                <span class="texto-pagina-atual">Página ${paginaSugestao} de ${totalPaginas}</span>
                <button type="button" class="botao-pagina-sugestao" data-acao="proxima" ${paginaSugestao === totalPaginas ? 'disabled' : ''}>
                    <i class="bi bi-chevron-right"></i>
                </button>
            </div>` : '';

        dropdownSugestoes.innerHTML = `<div class="sugestoes-lista">${listaHtml}</div>${paginacaoHtml}`;

        // Clique numa sugestão: preenche o campo e já busca
        dropdownSugestoes.querySelectorAll('.item-sugestao').forEach((item) => {
            item.addEventListener('mousedown', (e) => {
                e.preventDefault(); // evita perder o foco antes do clique registrar
                const palavra = item.dataset.palavra;
                campoTupi.value = palavra;
                fecharSugestoes();
                buscarPalavra(palavra.toLowerCase());
            });
        });

        // Botões de paginação do dropdown
        const botaoAnterior = dropdownSugestoes.querySelector('[data-acao="anterior"]');
        const botaoProxima = dropdownSugestoes.querySelector('[data-acao="proxima"]');

        if (botaoAnterior) {
            botaoAnterior.addEventListener('mousedown', (e) => {
                e.preventDefault();
                paginaSugestao--;
                renderizarSugestoes();
            });
        }
        if (botaoProxima) {
            botaoProxima.addEventListener('mousedown', (e) => {
                e.preventDefault();
                paginaSugestao++;
                renderizarSugestoes();
            });
        }
    }

    function abrirSugestoes() {
        dropdownSugestoes.classList.add('aberto');
    }

    function fecharSugestoes() {
        dropdownSugestoes.classList.remove('aberto');
    }

    // Ao clicar/focar no campo, carrega (ou reaproveita) a lista e mostra o dropdown
    campoTupi.addEventListener('focus', async () => {
        abrirSugestoes();
        if (todasPalavrasSugestao === null) {
            await carregarPalavrasSugestao();
        } else {
            renderizarSugestoes();
        }
    });

    // Filtra em tempo real conforme a pessoa digita
    campoTupi.addEventListener('input', () => {
        paginaSugestao = 1;
        if (todasPalavrasSugestao !== null) {
            renderizarSugestoes();
        }
        abrirSugestoes();
    });

    // Fecha o dropdown ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#campo-tupi') && !e.target.closest('#sugestoes-dropdown')) {
            fecharSugestoes();
        }
    });

    formPesquisa.addEventListener('submit', (e) => {
        e.preventDefault();
        fecharSugestoes();
        buscarPalavra(campoTupi.value.trim().toLowerCase());
    });

    window.preencherBusca = (termo) => {
        campoTupi.value = termo;
        buscarPalavra(termo.toLowerCase());
        resultadoContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
});