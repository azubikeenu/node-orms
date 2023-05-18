import request from 'supertest';
import TestUtils from '../../helpers/helpers';
import models from '../../../src/models';

describe('Logout', () => {
  let app;
  beforeAll(async () => {
    await TestUtils.startDataBase();
    app = TestUtils.getApp();
  });

  afterAll(async () => {
    await TestUtils.stopDatabase();
  });

  beforeEach(async () => {
    await TestUtils.syncDb();
  });
  it(`should return a 401 status code if the user isnt logged in`, async () => {
    const { body } = await request(app).post('/api/v1/logout').send().expect(401);
    expect(body.success).toBeFalsy();
  });

  it(`should retun a 200 status code and log out the user successfully`, async () => {
    const newUser = await TestUtils.registerNewUser();
    const { body } = await request(app)
      .post('/api/v1/logout')
      .set('Authorization', `Bearer ${newUser.data.accessToken}`)
      .send();
    expect(body.message).toEqual(`Successfully logged out`);
    const { RefreshToken, User } = models;
    const user = await User.findOne({ where: { email: TestUtils.email }, include: RefreshToken });
    expect(user.RefreshToken.token).toEqual(null);
  });
});
