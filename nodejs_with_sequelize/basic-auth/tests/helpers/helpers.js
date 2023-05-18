import '../../src/config';
import Database from '../../src/database';
import dbConfig from '../../src/config/database';
import request from 'supertest';

let db;

class TestUtils {
  static email = 'richard@gmail.com';
  static password = 'userpass';

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
      email = TestUtils.email,
      password = TestUtils.password,
      endpoint = '/api/v1/register',
      firstName = 'Richard',
      lastName = 'Enu',
    } = options;
    const { body } = await request(TestUtils.getApp()).post(endpoint).send({
      email,
      password,
      firstName,
      lastName,
    });
    return body;
  }
}

export default TestUtils;
