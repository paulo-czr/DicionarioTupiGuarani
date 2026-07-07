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

    this.server.use(cors());
    this.server.use(express.json());
  }

  routes() {
    this.server.use('/api/dicionario', dicionarioRoutes);
  }
}

export default new App().server;