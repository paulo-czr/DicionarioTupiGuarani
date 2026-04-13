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

    public Palavra verificarPorIdBanco(Long id){
        return repository.findById(id).orElseThrow(
            () -> new EntityNotFoundException("ID da Palavra não encontrado no Banco de Dados")
        );
    }

    public Palavra verificarPorPalavraArvore(String palavra){
        if (arvore.pesquisarPorPalavra(palavra) == null) {
            throw new EntityNotFoundException("ID da Palavra não encontrado no Banco de Dados");
        }

        return arvore.pesquisarPorPalavra(palavra);
    }
}
