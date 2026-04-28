// routes/dicionarioRoutes.js
import { Router } from "express";
import axios from "axios";

const routes = new Router();
// Certifique-se que a porta aqui é a que o JAVA está rodando (8080 ou 3000)
const JAVA_API_URL = "http://localhost:3000/api/dicionario";

routes.get("/contador", async (req, res) => {
  try {
    const response = await axios.get(`${JAVA_API_URL}/contador`);
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar contador no Java" });
  }
});

routes.get("/listar-em-ordem", async (req, res) => {
  try {
    const response = await axios.get(`${JAVA_API_URL}/listar-em-ordem`);
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar palavras" });
  }
});

routes.post("/inserir", async (req, res) => {
  try {
    const response = await axios.post(`${JAVA_API_URL}/inserir`, req.body);
    return res.status(201).json(response.data);
  } catch (error) {

    // Repassa a mensagem de erro do Java (ex: "Palavra já existe")
    const msg = error.response?.data || "Erro ao salvar no banco via Java";
    return res.status(error.response?.status || 500).json({ error: msg });
  }
});

routes.get("/pesquisar/termo/:termo", async (req, res) => {
  try {
    const { termo } = req.params;
    const response = await axios.get(
      `${JAVA_API_URL}/pesquisar/termo/${termo}`,
    );
    return res.json(response.data);
  } catch (error) {
    return res.status(404).json({ error: "Palavra não encontrada" });
  }
});

routes.put("/atualizar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.put(
      `${JAVA_API_URL}/atualizar/${id}`,
      req.body,
    );
    return res.json(response.data);
  } catch (error) {
    return res
      .status(error.response?.status || 500)
      .json({ error: "Erro ao atualizar palavra" });
  }
});

routes.delete("/remover/termo/:termo", async (req, res) => {
  try {
    const { termo } = req.params;
    await axios.delete(`${JAVA_API_URL}/remover/termo/${termo}`);
    return res.status(204).send();
  } catch (error) {
    return res
      .status(error.response?.status || 500)
      .json({ error: "Erro ao remover por termo" });
  }
});

routes.delete("/remover/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await axios.delete(`${JAVA_API_URL}/remover/id/${id}`);
    return res.status(204).send();
  } catch (error) {
    return res
      .status(error.response?.status || 500)
      .json({ error: "Erro ao remover por ID" });
  }
});

export default routes;
