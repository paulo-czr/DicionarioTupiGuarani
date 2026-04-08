package com.dicionario.DicionarioTupiGuarani.service;

import org.springframework.stereotype.Service;

import com.dicionario.DicionarioTupiGuarani.model.Palavra;
import com.dicionario.DicionarioTupiGuarani.repository.PalavraRepository;

@Service
public class PalavraService {

    private final PalavraRepository repository;

    public PalavraService(PalavraRepository repository){
        this.repository = repository;
    }

    public Palavra salvarPalavra(Palavra palavra){
        if (palavra == null) {
            throw new NullPointerException("A palavra não pode ser nula.");
        }
        
        return repository.save(palavra);
    }

    public void deletarPalavraPorId(Long id){
        if (!repository.existsById(id)) {
            throw new RuntimeException("O ID não foi encontrado.");
        }
        repository.deleteById(id);
    }

}
