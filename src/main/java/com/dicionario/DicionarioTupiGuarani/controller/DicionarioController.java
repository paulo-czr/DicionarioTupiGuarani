package com.dicionario.DicionarioTupiGuarani.controller;

import com.dicionario.DicionarioTupiGuarani.model.Palavra;
import com.dicionario.DicionarioTupiGuarani.service.DicionarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dicionario")
@CrossOrigin(origins = "*")
public class DicionarioController {

    private final DicionarioService service;

    public DicionarioController(DicionarioService service) {
        this.service = service;
    }

    @PostMapping("/inserir")
    public ResponseEntity<?> inserir(@RequestBody Palavra palavra) {
        try {
            Palavra salva = service.salvarPalavra(palavra);
            return ResponseEntity.status(HttpStatus.CREATED).body(salva);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/contador")
    public ResponseEntity<Integer> getContador() {
        int totalPalavras = service.buscarTodasPalavrasEmOrdem().size();
        return ResponseEntity.ok(totalPalavras);
    }

    @GetMapping("/listar-em-ordem")
    public ResponseEntity<List<Palavra>> listarEmOrdem() {
        List<Palavra> lista = service.buscarTodasPalavrasEmOrdem();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/listar-pre-ordem")
    public ResponseEntity<List<Palavra>> listarPreOrdem() {
        List<Palavra> lista = service.buscarTodasPalavrasPreOrdem();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/listar-pos-ordem")
    public ResponseEntity<List<Palavra>> listarPosOrdem() {
        List<Palavra> lista = service.buscarTodasPalavrasPosOrdem();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/listar-amplitude")
    public ResponseEntity<List<Palavra>> listarAmplitude() {
        List<Palavra> lista = service.buscarTodasPalavrasAmplitude();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/listar-profundidade")
    public ResponseEntity<List<Palavra>> listarProfundidade() {
        List<Palavra> lista = service.buscarTodasPalavrasProfundidade();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/pesquisar/palavra/{termo}")
    public ResponseEntity<Palavra> pesquisarPalavraPorTermo(@PathVariable String termo) {
        try {
            Palavra palavra = service.pesquisarPalavraPorTermo(termo);
            return ResponseEntity.ok(palavra);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/pesquisar/id/{id}")
    public ResponseEntity<Palavra> pesquisarPalavraPorId(@PathVariable Long id) {
        try {
            Palavra palavra = service.pesquisarPalavraPorId(id);
            return ResponseEntity.ok(palavra);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/atualizar/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Palavra novosDados) {
        try {
            Palavra atualizada = service.atualizarPalavraPorId(id, novosDados);
            return ResponseEntity.ok(atualizada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/remover/palavra/{termo}")
    public ResponseEntity<?> removerPorTermo(@PathVariable String termo) {
        try {
            service.deletarPalavraPorTermo(termo);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/remover/id/{id}")
    public ResponseEntity<?> removerPorId(@PathVariable Long id) {
        try {
            service.deletarPalavraPorId(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}