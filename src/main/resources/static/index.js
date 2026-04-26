// Função para atualizar o contador de palavras no rodapé
// novoValor é o número de palavras que queremos mostrar
function atualizarContador(novoValor) {
    const elementoContador = document.getElementById('contador-palavras');
    
    if (elementoContador) {
        elementoContador.innerText = novoValor;
    }
}

// Exemplo: Quando o site carrega, ele define como 20 (apenas ilustrativo)
document.addEventListener('DOMContentLoaded', () => {
    atualizarContador(20);
});

// Exemplo se as palavras estivessem em uma estrutura de Árvore:
// Supondo que 'minhaArvore' seja a instância da sua Árvore AVL
/*
const totalPalavras = minhaArvore.contarNos(); 
atualizarContador(totalPalavras);
*/