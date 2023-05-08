import '../../src/config';
import Database from '../../src/database';
import dbConfig from '../../src/config/database';

let db;

class TestUtils {
  static async startDataBase() {
    db = new Database(dbConfig, 'test');
    await db.connect();
    return db;
  }

  static async stopDatabase() {
    await db.disconnect();
  }

  static async syncDb() {
    await db.sync();
  }

  static getApp() {
    const App = require('../../src/app').default;
    return new App().getApp();
  }
}

export default TestUtils;
