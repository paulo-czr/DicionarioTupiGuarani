package com.dicionario.DicionarioTupiGuarani.structures;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import java.util.Stack;

import com.dicionario.DicionarioTupiGuarani.model.Palavra;

public class ArvoreAvl {

    private NoAvl raiz;

    /**
     * Retorna a altura de um nó.
     * 
     * @param no O nó a ter sua altura consultada.
     * @return A altura do nó, ou 0 se o nó for nulo.
     */
    private int getAltura(NoAvl no) {
        if (no == null)
            return 0;
        else
            return no.getAltura();
    }

    /**
     * Calcula o fator de balanceamento de um nó.
     * O fator é a diferença entre a altura da subárvore esquerda e a direita.
     * 
     * @param no O nó para calcular o fator.
     * @return O fator de balanceamento (int).
     */
    private int getFatorBalanceamento(NoAvl no) {
        if (no == null)
            return 0;
        NoAvl noEsq = no.getEsquerda();
        NoAvl noDir = no.getDireita();

        return getAltura(noEsq) - getAltura(noDir);
    }

    /**
     * Atualiza a altura de um nó com base na maior altura entre seus filhos.
     * 
     * @param no O nó que terá a altura atualizada.
     */
    private void atualizarAltura(NoAvl no) {
        int alturaEsq = getAltura(no.getEsquerda());
        int alturaDir = getAltura(no.getDireita());
        no.setAltura(Math.max(alturaEsq, alturaDir) + 1);
    }

    /**
     * Realiza uma Rotação Simples à Direita (LL).
     * Usada quando o desbalanceamento está à esquerda do filho à esquerda.
     * 
     * @param noDesbalanceado O nó desbalanceado.
     * @return O novo nó que ocupará a posição de noDesbalanceado após a rotação.
     */
    private NoAvl rotacionarDireita(NoAvl noDesbalanceado) {
        NoAvl novaRaiz = noDesbalanceado.getEsquerda();
        NoAvl subArvorePassageira = novaRaiz.getDireita();

        novaRaiz.setDireita(noDesbalanceado);
        noDesbalanceado.setEsquerda(subArvorePassageira);

        atualizarAltura(noDesbalanceado);
        atualizarAltura(novaRaiz);

        return novaRaiz;
    }

    /**
     * Realiza uma Rotação Simples à Esquerda (RR).
     * Usada quando o desbalanceamento está à direita do filho à direita.
     * 
     * @param noDesbalanceado O nó desbalanceado.
     * @return O novo nó que ocupará a posição de noDesbalanceado após a rotação.
     */
    private NoAvl rotacionarEsquerda(NoAvl noDesbalanceado) {
        NoAvl novaRaiz = noDesbalanceado.getDireita();
        NoAvl subArvorePassageira = novaRaiz.getEsquerda();

        novaRaiz.setEsquerda(noDesbalanceado);
        noDesbalanceado.setDireita(subArvorePassageira);

        atualizarAltura(noDesbalanceado);
        atualizarAltura(novaRaiz);

        return novaRaiz;
    }

    /**
     * Lista todas as Palavras Em Ordem alfabética
     * 
     * @return Lista com todas as palavras Em Ordem
     */
    public List<Palavra> listarPalavrasEmOrdem() {
        List<Palavra> listaPalavras = new ArrayList<>();
        criarListaEmOrdem(raiz, listaPalavras);
        return listaPalavras;
    }

    private void criarListaEmOrdem(NoAvl no, List<Palavra> lista) {
        if (no != null) {
            criarListaEmOrdem(no.getEsquerda(), lista);
            lista.add(no.getConteudo());
            criarListaEmOrdem(no.getDireita(), lista);
        }
    }

    /**
     * Lista todas as Palavras em Pré Ordem
     * 
     * @return Lista com todas as palavras Pré Ordem
     */
    public List<Palavra> listarPalavrasPreOrdem() {
        List<Palavra> listaPalavras = new ArrayList<>();
        criarListaPreOrdem(raiz, listaPalavras);
        return listaPalavras;
    }

    private void criarListaPreOrdem(NoAvl no, List<Palavra> lista) {
        if (no != null) {
            lista.add(no.getConteudo());
            criarListaPreOrdem(no.getEsquerda(), lista);
            criarListaPreOrdem(no.getDireita(), lista);
        }
    }

    /**
     * Lista todas as Palavras em Pós Ordem
     * 
     * @return Lista com todas as palavras Pós Ordem
     */
    public List<Palavra> listarPalavrasPosOrdem() {
        List<Palavra> listaPalavras = new ArrayList<>();
        criarListaPosOrdem(raiz, listaPalavras);
        return listaPalavras;
    }

    private void criarListaPosOrdem(NoAvl no, List<Palavra> lista) {
        if (no != null) {
            criarListaPosOrdem(no.getEsquerda(), lista);
            criarListaPosOrdem(no.getDireita(), lista);
            lista.add(no.getConteudo());
        }
    }

    /**
     * Insere uma nova palavra no dicionário.
     * 
     * @param palavra O objeto Palavra contendo o termo e seu significado.
     */
    public void inserir(Palavra palavra) {
        this.raiz = inserirRecursivo(this.raiz, palavra);
    }

    /**
     * Lógica recursiva para inserção e rebalanceamento da árvore.
     * Esse método evita duplicidade de palavras
     * 
     * @param no          O nó atual da recursão.
     * @param novaPalavra O objeto a ser inserido.
     * @return O nó (subárvore) resultante e balanceado.
     */
    private NoAvl inserirRecursivo(NoAvl no, Palavra novaPalavra) {
        if (no == null) {
            return new NoAvl(novaPalavra);
        }
        NoAvl noEsq = no.getEsquerda();
        NoAvl noDir = no.getDireita();
        Palavra palavraEntity = no.getConteudo();

        int comparacao = novaPalavra.getPalavra().compareToIgnoreCase(palavraEntity.getPalavra());

        if (comparacao < 0) {
            no.setEsquerda(inserirRecursivo(noEsq, novaPalavra));

        } else if (comparacao > 0) {
            no.setDireita(inserirRecursivo(noDir, novaPalavra));

        } else {
            return no;
        }

        return rebalancear(no);
    }

    /**
     * Busca uma palavra na árvore a partir do seu termo (String).
     * 
     * @param palavra A palavra em Tupi-Guarani a ser buscada.
     * @return O objeto Palavra encontrado ou null caso não exista.
     */
    public Palavra pesquisarPorPalavra(String palavra) {
        NoAvl noEncontrado = pesquisarRecursivo(this.raiz, palavra);

        if (noEncontrado != null)
            return noEncontrado.getConteudo();

        else
            return null;
    }

    private NoAvl pesquisarRecursivo(NoAvl no, String palavra) {
        if (no == null)
            return null;

        Palavra palavraEntity = no.getConteudo();

        int comparacao = palavra.compareToIgnoreCase(palavraEntity.getPalavra());

        if (comparacao == 0)
            return no;

        if (comparacao < 0) {
            return pesquisarRecursivo(no.getEsquerda(), palavra);
        } else {
            return pesquisarRecursivo(no.getDireita(), palavra);
        }
    }

    /**
     * Busca palavra por ID - Nota: perde desempenho
     * 
     * @param id ID da Palavra na Árvore
     * @return A Palavra encontrada na Árvore
     */
    public Palavra pesquisarPorId(Long id) {
        return pesquisarPorIdRecursivo(this.raiz, id);
    }

    private Palavra pesquisarPorIdRecursivo(NoAvl no, Long id) {
        if (no == null)
            return null;

        Palavra palavraEntity = no.getConteudo();

        if (palavraEntity.getId().equals(id)) {
            return no.getConteudo();
        }

        Palavra encontradaEsq = pesquisarPorIdRecursivo(no.getEsquerda(), id);
        if (encontradaEsq != null)
            return encontradaEsq;

        return pesquisarPorIdRecursivo(no.getDireita(), id);
    }

    /**
     * Remove uma palavra do dicionário com base no termo em Tupi-Guarani informado.
     * 
     * @param palavra A string da palavra em Tupi-Guarani a ser removido.
     */
    public void remover(String palavra) {
        this.raiz = removerRecursivo(this.raiz, palavra);
    }

    /**
     * Lógica recursiva para remoção, tratamento de nós com filhos e
     * rebalanceamento.
     * 
     * @param no      O nó atual da recursão.
     * @param palavra A palavra a ser buscado para remoção.
     * @return O nó resultante após a remoção e balanceamento.
     */
    private NoAvl removerRecursivo(NoAvl no, String palavra) {
        if (no == null)
            return null;

        Palavra palavraEntity = no.getConteudo();

        int comparacao = palavra.compareToIgnoreCase(palavraEntity.getPalavra());

        if (comparacao < 0) {
            no.setEsquerda(removerRecursivo(no.getEsquerda(), palavra));
            
        } else if (comparacao > 0) {
            no.setDireita(removerRecursivo(no.getDireita(), palavra));
        } else {
            no = executarRemocao(no);
        }

        if (no == null)
            return null;

        return rebalancear(no);
    }

    private NoAvl executarRemocao(NoAvl no) {
        if (no.getEsquerda() == null)
            return no.getDireita();

        if (no.getDireita() == null)
            return no.getEsquerda();

        // No com 2 filhos
        NoAvl sucessor = getMenorNo(no.getDireita());
        Palavra palavra = sucessor.getConteudo();
        no.setConteudo(palavra);
        no.setDireita(removerRecursivo(no.getDireita(), palavra.getPalavra()));
        return no;
    }

    /**
     * Busca o nó com o menor valor a partir de um ponto (mais à esquerda).
     * 
     * @param no O nó inicial da busca.
     * @return O nó com o menor conteúdo alfabético.
     */
    private NoAvl getMenorNo(NoAvl no) {
        NoAvl atual = no;
        while (atual.getEsquerda() != null)
            atual = atual.getEsquerda();
        return atual;
    }

    /**
     * Centraliza a lógica de balanceamento da árvore AVL.
     * Verifica os fatores de balanceamento e executa as rotações simples ou duplas.
     * 
     * @param no O nó que precisa ser verificado.
     * @return O nó após o devido balanceamento.
     */
    private NoAvl rebalancear(NoAvl no) {
        atualizarAltura(no);
        int fatorBalanceamento = getFatorBalanceamento(no);
        NoAvl noEsq = no.getEsquerda();
        NoAvl noDir = no.getDireita();

        // Desbalanceamento à Esquerda
        if (fatorBalanceamento > 1) {
            // Ponta do Joelho apontando para a ESQUERDA: Necessita rotação dupla
            if (getFatorBalanceamento(noEsq) < 0) {
                no.setEsquerda(rotacionarEsquerda(noEsq));
            }
            return rotacionarDireita(no);
        }

        // Desbalanceamento à Direita
        if (fatorBalanceamento < -1) {
            // Ponta do Joelho apontando para a DIREITA: Necessita rotação dupla
            if (getFatorBalanceamento(noDir) > 0) {
                no.setDireita(rotacionarDireita(noDir));
            }
            return rotacionarEsquerda(no);
        }

        return no;
    }

    /**
     * Retorna uma lista com todas as palavras em Amplitude (nível por nível).
     * 
     * @return Lista de Palavra Entity na ordem de largura.
     */
    public List<Palavra> listarEmAmplitude() {
        List<Palavra> lista = new ArrayList<>();

        if (this.raiz == null)
            return lista;

        Queue<NoAvl> fila = new LinkedList<>();
        fila.add(this.raiz);

        while (!fila.isEmpty()) {
            NoAvl noAtual = fila.poll();
            Palavra palavraEntity = noAtual.getConteudo();

            lista.add(palavraEntity);

            if (noAtual.getEsquerda() != null)
                fila.add(noAtual.getEsquerda());

            if (noAtual.getDireita() != null)
                fila.add(noAtual.getDireita());
        }
        return lista;
    }

    /**
     * Retorna uma lista com todas as palavras em Profundidade.
     * 
     * @return Lista de Palavra Entity na ordem de profundidade.
     */
    public void listarEmProfundide() {
        List<Palavra> lista = new ArrayList<>();
        if (this.raiz == null)
            return;

        Stack<NoAvl> pilha = new Stack<>();
        pilha.push(this.raiz);

        while (!pilha.isEmpty()) {
            NoAvl noAtual = pilha.pop();
            Palavra palavraEntity = noAtual.getConteudo();

            lista.add(palavraEntity);

            if (noAtual.getDireita() != null)
                pilha.push(noAtual.getDireita());

            if (noAtual.getEsquerda() != null)
                pilha.push(noAtual.getEsquerda());
        }
    }
}