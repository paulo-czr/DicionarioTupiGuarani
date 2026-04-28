// app.js
import express from 'express';
import cors from 'cors';
import dicionarioRoutes from './routes/dicionarioRoutes.js';

class App {
  constructor() {
    this.server = express();
    
    this.middlewares();
    this.routes();
  }

  middlewares() {
    // O CORS permite que seu Front-end (ex: porta 5500) acesse o Back (ex: porta 3000)
    this.server.use(cors());
    this.server.use(express.json());
  }

  routes() {
    // Conecta suas rotas de dicionário
    this.server.use('/api/dicionario', dicionarioRoutes);
  }
}

export default new App().server;