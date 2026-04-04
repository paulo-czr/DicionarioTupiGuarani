
// funcao para atualizar o contador de palavras no rodape
//novo valor é o numero de palavras que queremos mostrar

function atualizarContador(novoValor) {
    document.getElementById('contador-palavras').innerText = novoValor;
}

// Exemplo: Quando o site carrega, ele define como 20
atualizarContador(20);

// Exemplo se as palavras estivessem num Array:
const total = minhaArvore.contarNos(); 
document.getElementById('contador-palavras').innerText = total;