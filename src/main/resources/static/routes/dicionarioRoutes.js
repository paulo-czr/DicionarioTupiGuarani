// routes/dicionarioRoutes.js
import { Router } from "express";
import axios from "axios";

const routes = new Router();
const JAVA_API_URL = "http://localhost:3000/api/dicionario";

routes.get("/contador", async (req, res) => {
  try {
    const response = await axios.get(`${JAVA_API_URL}/contador`);
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar contador no Java - routes" });
  }
});

routes.get("/listar-em-ordem", async (req, res) => {
  try {
    const response = await axios.get(`${JAVA_API_URL}/listar-em-ordem`);
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar palavras em ordem - routes" });
  }
});

routes.get("/listar-pre-ordem", async (req, res) => {
  try {
    const response = await axios.get(`${JAVA_API_URL}/listar-pre-ordem`);
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar palavras em Pré-Ordem - routes" });
  }
});

routes.get("/listar-pos-ordem", async (req, res) => {
  try {
    const response = await axios.get(`${JAVA_API_URL}/listar-pos-ordem`);
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar palavras em Pós-Ordem - routes" });
  }
});

routes.get("/listar-amplitude", async (req, res) => {
  try {
    const response = await axios.get(`${JAVA_API_URL}/listar-amplitude`);
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar palavras em amplitude - routes" });
  }
});

routes.get("/listar-profundidade", async (req, res) => {
  try {
    const response = await axios.get(`${JAVA_API_URL}/listar-profundidade`);
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar palavras em profundidade - routes" });
  }
});

routes.post("/inserir", async (req, res) => {
  try {
    const response = await axios.post(`${JAVA_API_URL}/inserir`, req.body);
    return res.status(201).json(response.data);
  } catch (error) {

    const msg = error.response?.data || "Erro ao salvar no banco via Java - routes";
    return res.status(error.response?.status || 500).json({ error: msg });
  }
});

routes.get("/pesquisar/palavra/:termo", async (req, res) => {
  try {
    const { termo } = req.params;
    const response = await axios.get(
      `${JAVA_API_URL}/pesquisar/palavra/${termo}`,
    );
    return res.json(response.data);
  } catch (error) {
    return res.status(404).json({ error: "Palavra não encontrada - routes" });
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
      .json({ error: "Erro ao atualizar palavra - routes" });
  }
});

routes.delete("/remover/palavra/:termo", async (req, res) => {
  try {
    const { termo } = req.params;
    await axios.delete(`${JAVA_API_URL}/remover/palavra/${termo}`);
    return res.status(204).send();
  } catch (error) {
    return res
      .status(error.response?.status || 500)
      .json({ error: "Erro ao remover por palavra - routes" });
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
      .json({ error: "Erro ao remover por ID - routes" });
  }
});

export default routes;
