import { Sequelize } from 'sequelize';
import { registerModels } from '../models';
import cls from 'cls-hooked';

class Database {
  constructor(dbConfig, environment) {
    this.dbConfig = dbConfig;
    this.environment = environment;
    this.isTestEnvironment = this.environment === 'test';
  }

  getConnectionString() {
    const { host, username, password, port, database } = this.dbConfig[this.environment];
    return `postgres://${username}:${password}@${host}:${port}/${database}`;
  }

  async sync() {
    await this.connection.sync({ force: this.isTestEnvironment, logging: false });
    if (!this.isTestEnvironment) console.log(`database syncd successfully`);
  }

  async disconnect() {
    await this.connection.close();
  }

  async connect() {
    // set up namespace for transactions
    const namespace = cls.createNamespace('transaction_namespace');

    // use cls
    Sequelize.useCLS(namespace);

    const uri = this.getConnectionString();

    // Create a connection
    this.connection = new Sequelize(uri, {
      logging: this.isTestEnvironment ? false : console.log,
    });

    // Check Connection
    await this.connection.authenticate({ logging: false });

    if (!this.isTestEnvironment) console.log(`Connection to the database was successful`);

    // Register Models
    registerModels(this.connection);

    // Sync modules
    await this.sync();
  }
}

export default Database;
