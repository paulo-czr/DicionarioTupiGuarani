package com.dicionario.DicionarioTupiGuarani.structures;

import java.util.LinkedList;
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
        return getAltura(no.getEsquerda()) - getAltura(no.getDireita());
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

        Palavra palavraEntity = no.getConteudo();

        int comparacao = novaPalavra.getPalavra().compareToIgnoreCase(palavraEntity.getPalavra());

        if (comparacao < 0) {
            no.setEsquerda(inserirRecursivo(no.getEsquerda(), novaPalavra));

        } else if (comparacao > 0) {
            no.setDireita(inserirRecursivo(no.getDireita(), novaPalavra));

        } else {
            return no;
        }

        return rebalancear(no);
    }

    /**
     * Busca uma palavra na árvore a partir do seu termo (String).
     * 
     * @param termo O termo Tupi-Guarani a ser buscado.
     * @return O objeto Palavra encontrado ou null caso não exista.
     */
    public Palavra pesquisar(String termo) {
        NoAvl noEncontrado = pesquisarRecursivo(this.raiz, termo);

        if (noEncontrado != null)
            return noEncontrado.getConteudo();

        else
            return null;
    }

    private NoAvl pesquisarRecursivo(NoAvl no, String termo) {
        if (no == null)
            return null;

        Palavra palavraEntity = no.getConteudo();

        int comparacao = termo.compareToIgnoreCase(palavraEntity.getPalavra());

        if (comparacao == 0)
            return no;

        if (comparacao < 0) {
            return pesquisarRecursivo(no.getEsquerda(), termo);
        } else {
            return pesquisarRecursivo(no.getDireita(), termo);
        }
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
            // Nó folha ou com apenas um filho
            if (no.getEsquerda() == null || no.getDireita() == null) {
                no = (no.getEsquerda() != null) ? no.getEsquerda() : no.getDireita();

            } else {
                // Nó com dois filhos - Busca sucessor em ordem
                NoAvl sucessor = getMenorNo(no.getDireita());
                no.setConteudo(sucessor.getConteudo());
                no.setDireita(removerRecursivo(no.getDireita(), sucessor.getConteudo().getPalavra()));
            }
        }

        if (no == null)
            return null;

        return rebalancear(no);
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

        // Desbalanceamento à Esquerda
        if (fatorBalanceamento > 1) {
            // Caso Esquerda-Direita: Necessita rotação dupla
            if (getFatorBalanceamento(no.getEsquerda()) < 0) {
                no.setEsquerda(rotacionarEsquerda(no.getEsquerda()));
            }
            return rotacionarDireita(no);
        }

        // Desbalanceamento à Direita
        if (fatorBalanceamento < -1) {
            // Caso Direita-Esquerda: Necessita rotação dupla
            if (getFatorBalanceamento(no.getDireita()) > 0) {
                no.setDireita(rotacionarDireita(no.getDireita()));
            }
            return rotacionarEsquerda(no);
        }

        return no;
    }

    /**
     * Inicia o percurso em Pré-ordem a partir da raiz da árvore.
     * Raiz, Esquerda, Direita
     */
    public void preOrdem() {
        preOrdemRecursivo(this.raiz);
    }

    /**
     * Lógica recursiva para o percurso em Pré-ordem.
     * 
     * * @param no O nó atual da recursão sendo visitado.
     */
    private void preOrdemRecursivo(NoAvl no) {
        if (no != null) {

            Palavra palavraEntity = no.getConteudo();

            System.out.print(palavraEntity.getPalavra() + " ");

            preOrdemRecursivo(no.getEsquerda());

            preOrdemRecursivo(no.getDireita());
        }
    }

    /**
     * Inicia o percurso Em Ordem a partir da raiz da árvore.
     * Esquerda, Raiz, Direita
     * Ordem Alfabética
     */
    public void emOrdem() {
        emOrdemRecursivo(this.raiz);
    }

    /**
     * Lógica recursiva para o percurso Em Ordem.
     * 
     * @param no O nó atual da recursão.
     */
    private void emOrdemRecursivo(NoAvl no) {
        if (no != null) {

            Palavra palavraEntity = no.getConteudo();

            emOrdemRecursivo(no.getEsquerda());

            System.out.println(palavraEntity.getPalavra() + ": " + palavraEntity.getSignificado());

            emOrdemRecursivo(no.getDireita());
        }
    }

    /**
     * Inicia o percurso em Pós-ordem a partir da raiz da árvore.
     * Esquerda, Direita, Raiz
     */
    public void posOrdem() {
        posOrdemRecursivo(this.raiz);
    }

    /**
     * Lógica recursiva para o percurso em Pós-ordem.
     * 
     * @param no O nó atual da recursão.
     */
    private void posOrdemRecursivo(NoAvl no) {
        if (no != null) {
            Palavra palavraEntity = no.getConteudo();

            posOrdemRecursivo(no.getEsquerda());

            posOrdemRecursivo(no.getDireita());

            System.out.println("Visitando: " + palavraEntity.getPalavra());
        }
    }

    /**
     * Percorre a árvore em Amplitude, visitando nível por nível.
     * Não utiliza recursão, utilizando uma Fila (Queue) para gerenciar a ordem de
     * visita.
     */
    public void amplitude() {
        if (this.raiz == null) {
            return;
        }

        Queue<NoAvl> fila = new LinkedList<>();
        fila.add(this.raiz);

        while (!fila.isEmpty()) {
            NoAvl noAtual = fila.poll();
            Palavra palavraEntity = noAtual.getConteudo();

            System.out.print(palavraEntity.getPalavra() + " ");

            if (noAtual.getEsquerda() != null) {
                fila.add(noAtual.getEsquerda());
            }

            if (noAtual.getDireita() != null) {
                fila.add(noAtual.getDireita());
            }
        }
    }

    /**
     * Percorre a árvore em Profundidade de forma iterativa.
     * 
     * Utiliza uma Pilha (Stack) para simular o comportamento da pilha de recursão.
     */
    public void profundidade() {
        if (this.raiz == null) {
            return;
        }

        Stack<NoAvl> pilha = new Stack<>();
        pilha.push(this.raiz);

        while (!pilha.isEmpty()) {
            NoAvl noAtual = pilha.pop();

            Palavra palavraEntity = noAtual.getConteudo();

            System.out.print(palavraEntity.getPalavra() + " ");

            if (noAtual.getDireita() != null) {
                pilha.push(noAtual.getDireita());
            }

            if (noAtual.getEsquerda() != null) {
                pilha.push(noAtual.getEsquerda());
            }
        }
    }

}