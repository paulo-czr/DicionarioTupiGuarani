# ---------- Etapa 1: build da aplicação com Maven ----------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copia primeiro o pom.xml para aproveitar cache de dependências
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Agora copia o código-fonte e empacota o .jar (sem rodar os testes)
COPY src ./src
RUN mvn -B clean package -DskipTests

# ---------- Etapa 2: imagem final, só com o JRE ----------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 3000

ENTRYPOINT ["java", "-jar", "app.jar"]
