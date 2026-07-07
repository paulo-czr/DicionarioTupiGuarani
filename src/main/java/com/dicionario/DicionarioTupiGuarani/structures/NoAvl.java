package com.dicionario.DicionarioTupiGuarani.structures;

import com.dicionario.DicionarioTupiGuarani.model.Palavra;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoAvl {
    private Palavra conteudo;
    private NoAvl esquerda;
    private NoAvl direita;
    private int altura;

    public NoAvl(Palavra palavra) {
        this.conteudo = palavra;
        this.altura = 1;
    }

}
