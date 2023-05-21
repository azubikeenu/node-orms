import { DataSource } from 'typeorm';
import config from './config';
import EventEmitter from 'events';
import { Logger } from '../utils/winston';
import { User } from '../entities/user.entity';

const dbConfig = config[`${process.env.NODE_ENV}`];

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: dbConfig.host,
  port: dbConfig.port ? parseInt(dbConfig.port) : 3306,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  synchronize: true,
  logging: true,
  entities: [User],
});

class Database {
  public static emitter: EventEmitter = new EventEmitter();
  public static isConnected = false;
  public static logger = new Logger();

  public static async getConnection(callback = null, wait = false) {
    Database.handleConnectionError();
    return await Database.createConnection();
  }

  static async createConnection() {
    try {
      return await AppDataSource.initialize();
    } catch (error: any) {
      this.logger.log.error(error?.message);
      Database.logger.log.info('database connection error...retrying');
      Database.emitter.emit('DB_CONNECT_ERROR');
    }
  }

  public static async handleConnectionError() {
    Database.emitter.on('DB_CONNECT_ERROR', async () => {
      Database.logger.log.info('database connection error...retrying');
      setTimeout(async () => {
        await Database.createConnection();
      }, 3000);
    });
  }
}

export default Database;
