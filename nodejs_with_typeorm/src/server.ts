import dotenv from 'dotenv';

dotenv.config();

import { Logger } from './utils/winston';

const logger = new Logger();

import app from './app';
import config from 'config';
import DBservice from './database';

(async () => {
  try {
    const port = config.get<number>('port');
    await DBservice.getConnection();
    logger.log.info('Successfully connected to the database!!');
    app.listen(port, () => {
      logger.log.info(`App listening on port ${port}`);
    });
  } catch (err) {
    logger.log.error('An error occured while bootstraping the application');
    process.exit(1);
  }
})();
