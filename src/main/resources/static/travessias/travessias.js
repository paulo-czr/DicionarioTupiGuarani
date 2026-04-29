/**
 * Configuração da API - Alinhada com seu DicionarioController
 */
const API_BASE_URL = 'http://localhost:3000/api/dicionario'; 

/**
 * Mapeamento ajustado para os @GetMapping do seu Controller
 */
const tiposTravessia = {
    'Pré-ordem': 'listar-pre-ordem',
    'Em Ordem': 'listar-em-ordem',
    'Pós-ordem': 'listar-pos-ordem',
    'Profundidade (DFS)': 'listar-pre-ordem' // Em árvores, DFS é equivalente ao Pré-ordem
};

document.addEventListener('DOMContentLoaded', () => {
    inicializarEventos();
    // Inicia com "Em Ordem" por padrão
    buscarDadosTravessia('Em Ordem');
});

/**
 * Configura os listeners de clique nos botões de seleção
 */
function inicializarEventos() {
    const botoes = document.querySelectorAll('.row.g-3.mb-4 button');
    
    botoes.forEach(botao => {
        botao.addEventListener('click', (e) => {
            const smallTag = e.currentTarget.querySelector('small');
            if (!smallTag) return;

            const tipoSelecionado = smallTag.innerText;
            
            // Atualiza a interface visual (CSS)
            atualizarBotaoAtivo(e.currentTarget);
            
            // Faz a requisição ao backend
            buscarDadosTravessia(tipoSelecionado);
        });
    });
}

/**
 * Gerencia a troca de classes CSS entre os botões
 */
function atualizarBotaoAtivo(botaoClicado) {
    document.querySelectorAll('.row.g-3.mb-4 button').forEach(btn => {
        btn.classList.remove('btn-outline-success', 'border-success', 'border-2', 'bg-light', 'active-card');
        btn.classList.add('btn-outline-light', 'border');
    });

    botaoClicado.classList.remove('btn-outline-light', 'border');
    botaoClicado.classList.add('btn-outline-success', 'border-success', 'border-2', 'bg-light', 'active-card');
}

/**
 * Busca os dados do backend Java (Spring Boot)
 */
async function buscarDadosTravessia(tipo) {
    const endpoint = tiposTravessia[tipo];
    const listaContainer = document.getElementById('lista-travessia');
    
    if (!endpoint) return;

    // Feedback visual de carregamento
    listaContainer.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-success"></div></div>';

    try {
        // Chamada ao seu @GetMapping do DicionarioController
        const response = await fetch(`${API_BASE_URL}/${endpoint}`);
        
        if (!response.ok) throw new Error('Erro ao buscar dados do servidor');
        
        const dados = await response.json(); 
        renderizarLista(dados);
        atualizarTextoExplicativo(tipo);
        
    } catch (error) {
        console.error('Erro:', error);
        listaContainer.innerHTML = `
            <div class="alert alert-danger rounded-4">
                Não foi possível conectar ao servidor Java. Verifique se o backend está rodando.
            </div>`;
    }
}

/**
 * Injeta o HTML dos itens (Model Palavra) retornados pelo Java
 */
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
            </div>
        `;
        listaContainer.innerHTML += itemHtml;
    });
}

/**
 * Atualiza a legenda baseada na lógica de árvore binária
 */
function atualizarTextoExplicativo(tipo) {
    const legenda = document.querySelector('.alert-success p');
    const tituloLegenda = document.querySelector('.alert-success strong');
    
    if (tituloLegenda) tituloLegenda.innerText = tipo;
    if (!legenda) return;

    switch (tipo) {
        case 'Pré-ordem':
            legenda.innerText = 'Raiz → Esquerda → Direita (Exploração de cima para baixo)';
            break;
        case 'Em Ordem':
            legenda.innerText = 'Esquerda → Raiz → Direita (Garante a ordem alfabética)';
            break;
        case 'Pós-ordem':
            legenda.innerText = 'Esquerda → Direita → Raiz (Utilizado para remover folhas antes dos pais)';
            break;
        case 'Profundidade (DFS)':
            legenda.innerText = 'Explora o máximo possível cada ramo antes de retroceder (Usa Pré-ordem).';
            break;
    }
}