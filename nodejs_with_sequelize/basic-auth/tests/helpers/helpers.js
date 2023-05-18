import '../../src/config';
import Database from '../../src/database';
import dbConfig from '../../src/config/database';
import request from 'supertest';

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

  static async registerNewUser(options = {}) {
    const {
      email = 'richard@gmail.com',
      password = 'test123#',
      endpoint = '/api/v1/register',
      firstName = 'Richard',
      lastName = 'Enu',
    } = options;
    const { body } = (await request(TestUtils.getApp()).post(endpoint)).body({
      email,
      password,
      firstName,
      lastName,
    });
    return body;
  }
}

export default TestUtils;
