/**
 * Configuração da API
 */
const API_BASE_URL = 'http://localhost:3000/api/dicionario'; 

/**
 * Mapeamento ajustado para incluir Amplitude (BFS)
 */
const tiposTravessia = {
    'Pré-ordem': 'listar-pre-ordem',
    'Em Ordem': 'listar-em-ordem',
    'Pós-ordem': 'listar-pos-ordem',
    'Profundidade (DFS)': 'listar-pre-ordem',
    'Amplitude (BFS)': 'listar-amplitude' // Novo endpoint
};

document.addEventListener('DOMContentLoaded', () => {
    inicializarEventos();
    buscarDadosTravessia('Em Ordem');
});

function inicializarEventos() {
    // Seletor ajustado para encontrar os botões dentro das colunas
    const botoes = document.querySelectorAll('.row button');
    
    botoes.forEach(botao => {
        botao.addEventListener('click', (e) => {
            const smallTag = e.currentTarget.querySelector('small');
            if (!smallTag) return;

            const tipoSelecionado = smallTag.innerText;
            atualizarBotaoAtivo(e.currentTarget);
            buscarDadosTravessia(tipoSelecionado);
        });
    });
}

function atualizarBotaoAtivo(botaoClicado) {
    document.querySelectorAll('.row button').forEach(btn => {
        btn.classList.remove('btn-outline-success', 'border-success', 'border-2', 'bg-light', 'active-card');
        btn.classList.add('btn-outline-light', 'border');
    });

    botaoClicado.classList.remove('btn-outline-light', 'border');
    botaoClicado.classList.add('btn-outline-success', 'border-success', 'border-2', 'bg-light', 'active-card');
}

async function buscarDadosTravessia(tipo) {
    const endpoint = tiposTravessia[tipo];
    const listaContainer = document.getElementById('lista-travessia');
    
    if (!endpoint) return;

    listaContainer.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-success"></div></div>';

    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`);
        if (!response.ok) throw new Error('Erro ao buscar dados do servidor');
        
        const dados = await response.json(); 
        renderizarLista(dados);
        atualizarTextoExplicativo(tipo);
        
    } catch (error) {
        console.error('Erro:', error);
        listaContainer.innerHTML = `
            <div class="alert alert-danger rounded-4">
                Erro ao conectar ao backend na porta 3000. Verifique se o endpoint <strong>/${endpoint}</strong> existe.
            </div>`;
    }
}

function renderizarLista(itens) {
    const listaContainer = document.getElementById('lista-travessia');
    listaContainer.innerHTML = ''; 

    if (!itens || itens.length === 0) {
        listaContainer.innerHTML = '<p class="text-center text-muted">A árvore está vazia no momento.</p>';
        return;
    }

    itens.forEach((item, index) => {
        const itemHtml = `
            <div class="item-travessia border-gradient">
                <div class="badge-numero">${index + 1}</div>
                <div class="flex-grow-1">
                    <span class="item-palavra">${item.palavra}</span>
                    <span class="item-seta">→</span>
                    <span class="item-significado">${item.significado}</span>
                </div>
            </div>`;
        listaContainer.innerHTML += itemHtml;
    });
}

function atualizarTextoExplicativo(tipo) {
    const legenda = document.querySelector('.alert-success p');
    const tituloLegenda = document.querySelector('.alert-success strong');
    
    if (tituloLegenda) tituloLegenda.innerText = tipo;
    if (!legenda) return;

    switch (tipo) {
        case 'Pré-ordem':
            legenda.innerText = 'Raiz → Esquerda → Direita (Exploração de cima para baixo).';
            break;
        case 'Em Ordem':
            legenda.innerText = 'Esquerda → Raiz → Direita (Garante a ordem alfabética).';
            break;
        case 'Pós-ordem':
            legenda.innerText = 'Esquerda → Direita → Raiz (Processa os filhos antes do pai).';
            break;
        case 'Profundidade (DFS)':
            legenda.innerText = 'Explora o máximo possível cada ramo antes de retroceder.';
            break;
        case 'Amplitude (BFS)':
            legenda.innerText = 'Percorre a árvore nível por nível (horizontalmente), da esquerda para a direita.';
            break;
    }
}