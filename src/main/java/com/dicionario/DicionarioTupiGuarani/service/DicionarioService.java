package com.dicionario.DicionarioTupiGuarani.service;

import java.util.List;
import org.springframework.stereotype.Service;

import com.dicionario.DicionarioTupiGuarani.model.Palavra;
import com.dicionario.DicionarioTupiGuarani.repository.PalavraRepository;
import com.dicionario.DicionarioTupiGuarani.structures.ArvoreAvl;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;

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
     * Salva a entidade da Palavra na Arvore e no Banco de Dados
     * 
     * @param palavraEntity Entidade a ser salva no Banco
     * @return A entidade salva no Banco de Dados
     */
    public Palavra salvarPalavra(Palavra palavraEntity) {
        verificarPorIdBanco(palavraEntity.getId());
        verificarPorPalavraArvore(palavraEntity.getPalavra());

        Palavra palavraSalvaNoBanco = repository.save(palavraEntity);
        arvore.inserir(palavraSalvaNoBanco);

        return palavraSalvaNoBanco;
    }

    /**
     * Lista todas as Palavras presentes na ávore Em Ordem
     * 
     * @return Lista Em Ordem
     */
    public List<Palavra> buscarTodasPalavrasEmOrdem(){
        return arvore.listarPalavrasEmOrdem();
    }

        /**
     * Lista todas as Palavras presentes na ávore em Pré Ordem
     * 
     * @return Lista Pré Ordem
     */
    public List<Palavra> buscarTodasPalavrasPreOrdem(){
        return arvore.listarPalavrasPreOrdem();
    }

        /**
     * Lista todas as Palavras presentes na ávore em Pós Ordem
     * 
     * @return Lista Pós Ordem
     */
    public List<Palavra> buscarTodasPalavrasPosOrdem(){
        return arvore.listarPalavrasPosOrdem();
    }

    public Palavra pesquisarPalavraPorId(Long id){
        return repository.findById(id).orElseThrow(
            () -> new EntityNotFoundException("O ID da Palavra não foi encontrado no Banco de Dados.")
        );
    }

    /**
     * Verifica se a palavra existe no banco utilizando seu ID
     * 
     * @param id O identificador único de cada palavra para validação
     * @return retorna a Palavra se ela existir
     */
    public Palavra verificarPorIdBanco(Long id){
        return repository.findById(id).orElseThrow(
            () -> new EntityNotFoundException("ID da Palavra não encontrado no Banco de Dados")
        );
    }

    /**
     * Verifica se a Palavra existe no Banco de Dados usando um termo para pesquisa
     * 
     * @param palavra o termo que deseja verificar se existe no banco
     * @return a Palavra existente
     */
    public Palavra verificarPorPalavraArvore(String palavra){
        if (arvore.pesquisarPorPalavra(palavra) == null) {
            throw new EntityNotFoundException("ID da Palavra não encontrado no Banco de Dados");
        }

        return arvore.pesquisarPorPalavra(palavra);
    }
}
