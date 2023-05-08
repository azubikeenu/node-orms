import express from 'express';
import logger from 'morgan';
import environment from './config/env';

class App {
  constructor() {
    this.app = express();
    // add middlewares
    this.app.use(logger('dev', { skip: (req, res) => environment.nodeEnv === 'test' }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.setRoutes();
  }

  setRoutes() {}

  getApp() {
    return this.app;
  }
  listen() {
    const { port } = environment;
    this.app.listen(port, () => {
      console.log(`App listening on port : ${port}`);
    });
  }
}

export default App;
