package com.dicionario.DicionarioTupiGuarani.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dicionario.DicionarioTupiGuarani.model.Palavra;

public interface PalavraRepository extends JpaRepository <Palavra, Long> {

}
