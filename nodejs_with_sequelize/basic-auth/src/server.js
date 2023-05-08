import './config';
import Database from './database';

import environment from './config/env';

import dbConfig from './config/database';

(async () => {
  try {
    const db = new Database(dbConfig, environment.nodeEnv);
    await db.connect();
  } catch (err) {
    console.log(`Unable to connect to the database ${err?.stack}`);
    process.exit(1);
  }
})();
