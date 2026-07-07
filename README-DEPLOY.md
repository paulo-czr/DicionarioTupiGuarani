# Como rodar o Dicionário Tupi-Guarani (modo demonstração)

Este projeto foi preparado para rodar em qualquer máquina com **Docker** instalado,
sem precisar instalar Java, Maven ou MySQL manualmente.

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e aberto
  (Windows, Mac ou Linux). Isso já inclui o Docker Compose.

## Como rodar

1. Baixe/extraia este projeto.
2. Abra um terminal na pasta do projeto (onde está o arquivo `docker-compose.yml`).
3. Rode:

   ```bash
   docker compose up --build
   ```

4. Aguarde o log mostrar algo como `Started DicionarioTupiGuaraniApplication`.
5. Abra o navegador em: **http://localhost:3000**

Pronto — o dicionário já sobe com as **323 palavras** do `data.sql` cadastradas
automaticamente na Árvore AVL.

## Como parar

```bash
docker compose down
```

Isso para e remove os containers. Para também apagar o volume do banco de dados
(zerar tudo e voltar ao estado inicial na próxima subida):

```bash
docker compose down -v
```

## O que o Docker Compose sobe

| Serviço | O que é                          | Porta        |
|---------|-----------------------------------|--------------|
| `mysql` | Banco de dados MySQL 8            | 3306         |
| `app`   | Backend Spring Boot + Frontend    | 3000         |

O frontend (HTML/CSS/JS) é servido pelo próprio Spring Boot, então tudo roda
em **http://localhost:3000** — não existem dois servidores separados.

## Importante: comportamento pensado para demonstração

Para garantir que **qualquer pessoa** que suba o projeto sempre veja o dicionário
completo e populado, o ambiente Docker está configurado (via variáveis de ambiente
no `docker-compose.yml`, sem alterar seu `application.properties` original) para:

- Recriar o schema do banco toda vez que os containers sobem (`ddl-auto=create-drop`)
- Rodar o `data.sql` novamente a cada start (`spring.sql.init.mode=always`)

**Na prática isso significa:** toda vez que você rodar `docker compose up` (sem o volume
ter sido apagado com `-v`... na verdade o schema é recriado de qualquer forma), o banco
volta ao estado original do `data.sql` — qualquer palavra inserida ou removida durante
os testes anteriores não é mantida entre reinicializações do container `app`.

Isso é intencional para um ambiente de **demonstração**: cada pessoa que for testar
começa sempre do mesmo estado "limpo" com as 323 palavras. Se no futuro você quiser
que os dados persistam entre reinicializações (comportamento mais parecido com produção),
basta remover essas três variáveis de ambiente do serviço `app` no `docker-compose.yml`
e trocar o `data.sql` para usar `INSERT IGNORE` (ou adicionar uma constraint `UNIQUE`
na coluna `palavra`), evitando erro de chave duplicada quando ele rodar mais de uma vez
sobre dados já existentes.

## Rodando sem Docker (modo de desenvolvimento normal)

O `application.properties` continua funcionando exatamente como antes para quem
já tem MySQL instalado localmente — nada nele foi quebrado, apenas os valores de
usuário/senha/URL do banco agora também podem ser sobrescritos por variáveis de
ambiente (usadas pelo Docker Compose). Rodando localmente sem definir essas
variáveis, o comportamento é idêntico ao original.
