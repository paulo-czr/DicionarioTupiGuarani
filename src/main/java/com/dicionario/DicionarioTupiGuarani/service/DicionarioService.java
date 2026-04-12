package com.dicionario.DicionarioTupiGuarani.service;

import java.util.List;
import org.springframework.stereotype.Service;

import com.dicionario.DicionarioTupiGuarani.model.Palavra;
import com.dicionario.DicionarioTupiGuarani.repository.PalavraRepository;
import com.dicionario.DicionarioTupiGuarani.structures.ArvoreAvl;

import jakarta.annotation.PostConstruct;

@Service
public class DicionarioService {

    private final PalavraRepository repository;
    private final ArvoreAvl arvore = new ArvoreAvl();

    public DicionarioService(PalavraRepository repository) {
        this.repository = repository;
    }

    /**
     * Inicia a Arvore com todos os dados do Banco de Dados
     */
    @PostConstruct
    public void inicializarArvore() {
        List<Palavra> todasAsPalavras = repository.findAll();

        for (Palavra p : todasAsPalavras) {
            arvore.inserir(p);
        }
    }

    /**
     * Salva a entidade da Palavra na Arvore e no Banco de Dados
     * 
     * @param palavraEntity Entidade a ser salva no Banco
     * @return A entidade salva
     */
    public Palavra salvarPalavra(Palavra palavraEntity) {
        Palavra salvaNoBanco = repository.save(palavraEntity);
        arvore.inserir(salvaNoBanco);

        return salvaNoBanco;
    }
}
