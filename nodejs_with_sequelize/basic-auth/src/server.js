import './config';

import Database from './database';

import environment from './config/env';

import dbConfig from './config/database';

(async () => {
  try {
    const db = new Database(dbConfig, environment.nodeEnv);
    await db.connect();
    // import the application
    // we use require here because the database needs to be connected and models instantiated before the app loads
    const App = require('./app').default;
    const app = new App();
    app.listen();
  } catch (err) {
    console.log(`Unable to connect to the database ${err?.stack}`);
    process.exit(1);
  }
})();
