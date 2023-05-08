import express from 'express';
import logger from 'morgan';
import environment from './config/env';
import errorsMiddleware from './middlewares/errors.middleware';

class App {
  constructor() {
    this.app = express();
    // add middlewares
    this.app.use(logger('dev', { skip: (req, res) => environment.nodeEnv === 'test' }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.setRoutes();
  }

  setRoutes() {
    this.app.use(errorsMiddleware);
  }

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
