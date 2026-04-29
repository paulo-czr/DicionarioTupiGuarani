package com.dicionario.DicionarioTupiGuarani.service;

import java.util.List;
import org.springframework.stereotype.Service;

import com.dicionario.DicionarioTupiGuarani.model.Palavra;
import com.dicionario.DicionarioTupiGuarani.repository.PalavraRepository;
import com.dicionario.DicionarioTupiGuarani.structures.ArvoreAvl;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class DicionarioService {

    private final PalavraRepository repository;
    private final ArvoreAvl arvore = new ArvoreAvl();
    private List<Palavra> todasAsPalavras;

    public DicionarioService(PalavraRepository repository) {
        this.repository = repository;
    }

    /**
     * Inicia a Arvore com todos os dados do Banco de Dados
     */
    @PostConstruct
    public void inicializarArvore() {
        todasAsPalavras = repository.findAll();

        for (Palavra p : todasAsPalavras) {
            arvore.inserir(p);
        }
    }

    /**
     * Obtém a instância da Árvore AVL utilizada pelo serviço
     * * @return A estrutura da Árvore AVL
     */
    public ArvoreAvl getArvore() {
        return this.arvore;
    }

    /**
     * Salva a entidade da Palavra na Arvore e no Banco de Dados
     * * @param palavraEntity Entidade a ser salva no Banco
     * 
     * @return A entidade salva no Banco de Dados
     */
    @Transactional
    public Palavra salvarPalavra(Palavra palavraEntity) {
        if (palavraEntity.getPalavra() != null) {
            if (arvore.pesquisarPorPalavra(palavraEntity.getPalavra()) != null) {
                throw new RuntimeException("Esta palavra já existe no dicionário!");
            }
        }
        Palavra palavraSalvaNoBanco = repository.save(palavraEntity);
        arvore.inserir(palavraSalvaNoBanco);
        return palavraSalvaNoBanco;
    }

    /**
     * Lista todas as Palavras presentes na ávore Em Ordem
     * * @return Lista Em Ordem
     */
    public List<Palavra> buscarTodasPalavrasEmOrdem() {
        return arvore.listarPalavrasEmOrdem();
    }

    /**
     * Lista todas as Palavras presentes na ávore em Pré Ordem
     * * @return Lista Pré Ordem
     */
    public List<Palavra> buscarTodasPalavrasPreOrdem() {
        return arvore.listarPalavrasPreOrdem();
    }

    /**
     * Lista todas as Palavras presentes na ávore em Pós Ordem
     * * @return Lista Pós Ordem
     */
    public List<Palavra> buscarTodasPalavrasPosOrdem() {
        return arvore.listarPalavrasPosOrdem();
    }

    /**
     * Lista todas as Palavras presentes na ávore por Amplitude
     * * @return Lista em Amplitude
     */
    public List<Palavra> buscarTodasPalavrasAmplitude() {
        return arvore.listarEmAmplitude();
    }

    
    /**
     * Lista todas as Palavras presentes na ávore por Profundidade
     * * @return Lista em Profundidade
     */
    public List<Palavra> buscarTodasPalavrasProfundidade() {
        return arvore.listarEmProfundidade();
    }

    /**
     * Pesquisa uma palavra na Árvore AVL através do termo informado
     * * @param termo O texto da palavra a ser buscada
     * 
     * @return A entidade Palavra encontrada
     * @throws EntityNotFoundException Caso o termo não exista na árvore
     */
    public Palavra pesquisarPalavraPorTermo(String termo) {
        Palavra encontrada = arvore.pesquisarPorPalavra(termo);
        if (encontrada == null) {
            throw new EntityNotFoundException("Termo '" + termo + "' não encontrado na árvore.");
        }
        return encontrada;
    }

    /**
     * Pesquisa uma palavra diretamente no Banco de Dados através do seu ID
     * * @param id O identificador único da palavra
     * 
     * @return A entidade Palavra correspondente
     * @throws EntityNotFoundException Caso o ID não seja encontrado
     */
    public Palavra pesquisarPalavraPorId(Long id) {
        return repository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("O ID " + id + " não foi encontrado no Banco de Dados."));
    }

    /**
     * Atualiza os dados de uma palavra no Banco e sincroniza com a Árvore AVL.
     * Caso o termo (String) mude, a árvore é reestruturada para manter a ordenação.
     * * @param id O ID da palavra a ser atualizada
     * 
     * @param novaPalavra Objeto contendo os novos dados
     * @return A entidade Palavra atualizada
     */
    @Transactional
    public Palavra atualizarPalavraPorId(Long id, Palavra novaPalavra) {
        Palavra palavraAntiga = pesquisarPalavraPorId(id);

        boolean termoMudou = !palavraAntiga.getPalavra().equalsIgnoreCase(novaPalavra.getPalavra());

        if (termoMudou) {
            arvore.remover(palavraAntiga.getPalavra());
        }

        palavraAntiga.setPalavra(novaPalavra.getPalavra());
        palavraAntiga.setSignificado(novaPalavra.getSignificado());

        Palavra atualizada = repository.save(palavraAntiga);

        if (termoMudou) {
            arvore.inserir(atualizada);
        } else {
            // Se só mudou o significado, apenas atualizamos o conteúdo do nó na árvore
            Palavra naArvore = arvore.pesquisarPorPalavra(atualizada.getPalavra());
            if (naArvore != null)
                naArvore.setSignificado(atualizada.getSignificado());
        }

        return atualizada;
    }

    /**
     * Remove uma palavra do Banco de Dados e da Árvore AVL através do ID
     * * @param id O identificador da palavra a ser removida
     */
    @Transactional
    public void deletarPalavraPorId(Long id) {
        Palavra palavra = pesquisarPalavraPorId(id);
        repository.delete(palavra);
        arvore.remover(palavra.getPalavra());
    }

    /**
     * Remove uma palavra do Banco de Dados e da Árvore AVL através do termo
     * (String)
     * * @param termo O texto da palavra a ser removida
     * 
     * @throws EntityNotFoundException Caso o termo não seja encontrado
     */
    @Transactional
    public void deletarPalavraPorTermo(String termo) {
        Palavra palavra = arvore.pesquisarPorPalavra(termo);
        if (palavra != null) {
            repository.delete(palavra);
            arvore.remover(termo);
        } else {
            throw new EntityNotFoundException("Não é possível deletar: Termo não encontrado.");
        }
    }

    /**
     * Verifica se a palavra existe no banco utilizando seu ID
     * * @param id O identificador único de cada palavra para validação
     * 
     * @return retorna a Palavra se ela existir
     */
    public Palavra verificarPorIdBanco(Long id) {
        return repository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("ID não encontrado no Banco de Dados"));
    }

    /**
     * Verifica se a Palavra existe no Banco de Dados usando um termo para pesquisa
     * * @param palavra o termo que deseja verificar se existe no banco
     * 
     * @return a Palavra existente
     */
    public Palavra verificarPorPalavraArvore(String palavra) {
        Palavra p = arvore.pesquisarPorPalavra(palavra);
        if (p == null) {
            throw new EntityNotFoundException("Palavra '" + palavra + "' não encontrada na Árvore.");
        }
        return p;
    }
}