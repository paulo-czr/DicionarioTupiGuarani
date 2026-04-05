package com.dicionario.DicionarioTupiGuarani.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "palavras")
public class Palavra implements Comparable<Palavra> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String palavra;
    
    private String significado;

    /**
     * Compara esta palavra com outra para definir a ordem de classificação.
     *
     * @param outra a palavra a ser comparada com esta
     * @return um valor inteiro que indica a ordem: <br>
     *         
     * valor negativo (< 0): esta palavra vem antes da outra <br>
     * zero (0): as duas palavras são iguais <br>
     * valor positivo (> 0): esta palavra vem depois da outra 
     */
    @Override
    public int compareTo(Palavra outra) {
        return this.palavra.compareToIgnoreCase(outra.getPalavra());
    }
}
