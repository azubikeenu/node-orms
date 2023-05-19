import dotenv from 'dotenv';

dotenv.config();

import Logger from './utils/logger';

import app from './app';
import config from 'config';

(async () => {
  try {
    const port = config.get<number>('port');

    app.listen(port, () => {
      Logger.info(`App listening on port ${port}`);
    });
  } catch (err) {
    Logger.error('An error occured while bootstraping the application');
    process.exit(1);
  }
})();
