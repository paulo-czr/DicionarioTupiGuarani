package com.dicionario.DicionarioTupiGuarani.controller;

import com.dicionario.DicionarioTupiGuarani.model.Palavra;
import com.dicionario.DicionarioTupiGuarani.service.DicionarioService;
import com.dicionario.DicionarioTupiGuarani.structures.ArvoreAvl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Provider.Service;
import java.util.List;

@RestController
@RequestMapping("/api/dicionario")
@CrossOrigin(origins = "*") // Permite que o seu HTML acesse o Java sem erros de segurança
public class DicionarioController {

    // Instância única da árvore para todo o sistema
    private final ArvoreAvl arvore;
    private final DicionarioService service;

    public DicionarioController(DicionarioService service) {
        this.arvore = new ArvoreAvl();
        this.service = service;
    }

    @PostMapping("/inserir")
    public ResponseEntity<String> inserir(@RequestBody Palavra palavra) {
        //verificar se a palavra já existe na árvore 
        service.salvarPalavra(palavra);
        arvore.inserir(palavra);
        return ResponseEntity.ok("Palavra inserida com sucesso!");
    }

    @GetMapping("/contador")
    public ResponseEntity<Integer> getContador() {
        // Usando o método listar para contar o tamanho da lista
        return ResponseEntity.ok(arvore.listarPalavrasEmOrdem().size());
    }

    @GetMapping("/listar-em-ordem")
    public ResponseEntity<List<Palavra>> listarEmOrdem() {
        return ResponseEntity.ok(arvore.listarPalavrasEmOrdem());
    }

    @GetMapping("/listar-pre-ordem")
    public ResponseEntity<List<Palavra>> listarPreOrdem() {
        return ResponseEntity.ok(arvore.listarPalavrasPreOrdem());
    }

    @GetMapping("/listar-pos-ordem")
    public ResponseEntity<List<Palavra>> listarPosOrdem() {
        return ResponseEntity.ok(arvore.listarPalavrasPosOrdem());
    }

    @GetMapping("/pesquisar/{termo}")
    public ResponseEntity<Palavra> pesquisarPalavraPorTermo(@PathVariable String termo) {
        Palavra encontrada = arvore.pesquisarPorPalavra(termo);
        if (encontrada != null) {
            return ResponseEntity.ok(encontrada);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/pesquisar/{id}")
    public ResponseEntity<Palavra> pesquisarPalavraPorId(@PathVariable Long id) {
        Palavra encontrada = service.pesquisarPalavraPorId(id);
        if (encontrada != null) {
            return ResponseEntity.ok(encontrada);
        }
        return ResponseEntity.notFound().build();

    }

    @DeleteMapping("/remover/{termo}")
    public ResponseEntity<Void> remover(@PathVariable String termo) {
        arvore.remover(termo);
        return ResponseEntity.ok().build();
    }
}