// index.js
async function atualizarContador() {
    const elementoContador = document.getElementById('contador-palavras');
    
    if (elementoContador) {
        try {
            // URL do seu endpoint Spring Boot
            const resposta = await fetch('http://localhost:8080/api/dicionario/contador');
            const total = await resposta.json();
            
            elementoContador.innerText = total;
        } catch (erro) {
            console.error("Erro ao buscar contador do Java:", erro);
            elementoContador.innerText = "0"; // Valor padrão em caso de erro
        }
    }
}

// Executa quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    atualizarContador();
});