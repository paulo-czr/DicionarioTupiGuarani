package com.dicionario.DicionarioTupiGuarani;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class DicionarioTupiGuaraniApplication {

	public static void main(String[] args) {

		// Carrega o arquivo .env da raiz do projeto
        Dotenv dotenv = Dotenv.configure()
            .ignoreIfMissing()
            .load();
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });

		SpringApplication.run(DicionarioTupiGuaraniApplication.class, args);
	}

}
