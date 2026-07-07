<h1 align="center">
  Dicionário Tupi-Guarani com Árvore AVL
</h1>

<p align="center">
  Sistema de dicionário bilíngue (Tupi-Guarani / Português) que utiliza uma
  Árvore AVL implementada do zero para garantir inserção, busca e remoção
  em tempo logarítmico — com um front-end temático completo para
  visualizar cada operação da estrutura de dados.
</p>

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=java,spring,mysql,html,css,js,docker,git&theme=dark" />
  </a>
</p>

---

## Sumário

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Telas do Sistema](#telas-do-sistema)
- [Endpoints da API](#endpoints-da-api)
- [Como Executar o Projeto](#como-executar-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Autores](#autores)

---

## Tecnologias Utilizadas

#### Back-end
- **Java 21 & Spring Boot:** API REST e regras de negócio.
- **Árvore AVL própria:** implementação customizada (sem bibliotecas prontas) com rotações simples e duplas para manter a estrutura sempre balanceada.
- **Spring Data JPA / Hibernate:** persistência e mapeamento objeto-relacional.
- **MySQL 8:** banco de dados relacional, usado como fonte de verdade dos dados (a AVL é reconstruída em memória a partir dele).

#### Front-end
- **HTML5 & CSS3:** interface própria com tema visual autoral (paleta inspirada na cultura Tupi-Guarani).
- **JavaScript (Vanilla):** consumo da API via Fetch API, manipulação de DOM orientada a objetos e paginação client-side.
- **Bootstrap 5 & Bootstrap Icons:** grid responsivo e iconografia.

#### Infraestrutura
- **Docker & Docker Compose:** containerização da aplicação e do banco de dados, permitindo que qualquer pessoa suba o projeto localmente com um único comando, sem instalar Java, Maven ou MySQL.

> O front-end é servido diretamente pelo próprio Spring Boot como recursos estáticos — API e interface rodam na mesma porta, sem necessidade de um servidor separado.

---

## Arquitetura

O projeto segue uma arquitetura enxuta de duas camadas:

1. **Client (Front-end estático):** páginas HTML/CSS/JS servidas pelo Spring Boot, que consomem a API diretamente via Fetch API.
2. **Service Provider (Spring Boot):** concentra a lógica da Árvore AVL, expõe os endpoints REST e gerencia a persistência no MySQL via JPA/Hibernate.

Fluxo de uma operação (ex.: inserir uma palavra):

```
Front-end (fetch) → Controller (REST) → Service (lógica) → Árvore AVL (memória) + Repository (MySQL)
```

Ao subir, a aplicação carrega os dados do MySQL para reconstruir a Árvore AVL em memória, garantindo que toda busca, inserção e remoção aproveite a complexidade O(log n) da estrutura balanceada.

---

## Funcionalidades Principais

- **Inserção Balanceada:** adição de novos termos com rebalanceamento automático da árvore (rotações à esquerda/direita, simples e duplas).
- **Busca Otimizada:** localização de termos em complexidade O(log n), por termo exato ou por ID.
- **Listagem com Busca e Paginação:** filtro em tempo real por palavra ou significado, com paginação (`1 ... 4 5 6 ... 54`).
- **Remoção Completa:** contempla os três casos clássicos de remoção em BST/AVL (nó sem filhos, com um filho, com dois filhos), com rebalanceamento após a remoção.
- **Visualização de Travessias:** exibição interativa dos 5 percursos da árvore — Pré-ordem, Em Ordem, Pós-ordem, Profundidade (DFS) e Amplitude (BFS) — também com paginação.
- **Atualização de Registros:** edição de palavras já cadastradas por ID.

---

## Telas do Sistema

| Tela | Descrição |
|------|-----------|
| **Início** | Visão geral do sistema e contador de palavras cadastradas. |
| **Inserir** | Formulário para cadastrar novas palavras na árvore. |
| **Pesquisar** | Busca de uma palavra específica pelo termo. |
| **Listar e Remover** | Lista completa do dicionário com busca, estatísticas (total, primeira e última palavra) e remoção. |
| **Travessias** | Visualização dos 5 tipos de percurso da árvore, com explicação de cada um. |

---

## Endpoints da API

Base path: `/api/dicionario`

### Palavras

| Método | Endpoint                                  | Descrição                                              |
|--------|--------------------------------------------|---------------------------------------------------------|
| POST   | `/inserir`                                  | Cria uma nova palavra no dicionário                     |
| GET    | `/contador`                                 | Retorna a quantidade total de palavras cadastradas      |
| GET    | `/listar-em-ordem`                          | Lista todas as palavras em ordem simétrica (in-order)   |
| GET    | `/listar-pre-ordem`                         | Lista todas as palavras em pré-ordem (pre-order)        |
| GET    | `/listar-pos-ordem`                         | Lista todas as palavras em pós-ordem (post-order)       |
| GET    | `/listar-amplitude`                         | Lista todas as palavras em amplitude/largura (BFS)      |
| GET    | `/listar-profundidade`                      | Lista todas as palavras em profundidade (DFS)           |
| GET    | `/pesquisar/palavra/{termo}`                | Busca uma palavra específica pelo termo                 |
| GET    | `/pesquisar/id/{id}`                        | Busca uma palavra específica pelo ID                    |
| PUT    | `/atualizar/{id}`                           | Atualiza os dados de uma palavra existente pelo ID       |
| DELETE | `/remover/palavra/{termo}`                  | Remove uma palavra do dicionário pelo termo             |
| DELETE | `/remover/id/{id}`                          | Remove uma palavra do dicionário pelo ID                |

#### Exemplo de requisição — criar/atualizar uma palavra

```json
{
  "palavra": "Abaporu",
  "significado": "Homem que come gente (tupi-guarani)."
}
```

#### Exemplo de resposta de erro padronizada (404 Not Found)

```json
{
  "message": "Palavra não encontrada no dicionário."
}
```

---

## Como Executar o Projeto

### Opção recomendada: Docker (não precisa instalar Java, Maven ou MySQL)

**Pré-requisito:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução.

```bash
git clone [<url-do-repositorio>]
cd DicionarioTupiGuarani
docker compose up --build
```

Acesse **http://localhost:3000** — a aplicação já sobe com as palavras do `data.sql` cadastradas automaticamente.

Para parar:

```bash
docker compose down
```

> Detalhes sobre o comportamento do banco em modo Docker (recriação do schema a cada subida, pensado para demonstração) estão no [`README.md`](./README.md).

### Opção alternativa: execução manual (ambiente de desenvolvimento)

**Pré-requisitos:** Java 21, Maven (ou use o `mvnw` incluso) e um MySQL rodando localmente.

1. Configure `src/main/resources/application.properties` com as credenciais do seu MySQL.
2. Rode:
   ```bash
   ./mvnw spring-boot:run
   ```
3. Acesse **http://localhost:3000**.

---

## Estrutura do Projeto

```
DicionarioTupiGuarani/
├── src/main/java/com/dicionario/DicionarioTupiGuarani/
│   ├── controller/     # Endpoints REST
│   ├── service/        # Regras de negócio
│   ├── structures/     # Implementação própria da Árvore AVL
│   ├── model/          # Entidade JPA (Palavra)
│   └── repository/     # Acesso ao MySQL via Spring Data JPA
├── src/main/resources/
│   ├── static/          # Front-end (HTML, CSS, JS) por tela
│   ├── data.sql         # Massa inicial de dados (323 palavras)
│   └── application.properties
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Autores

**Arthur de Pinho**
💼 [LinkedIn](linkedin.com/in/arthur-pinho-499131253)

**Ian Vitor**
💼 [LinkedIn](linkedin.com/in/ian-vitor-vale-moreira-88574031a)

**Paulo Cesar**
📧 [PauloCesarCoder@gmail.com](mailto:PauloCesarCoder@gmail.com)
🌐 [GitHub](https://github.com/paulo-czr)
💼 [LinkedIn](https://www.linkedin.com/in/paulo-czr)

**Juan Douglas**
💼 [LinkedIn](linkedin.com/in/juan-douglas04)
