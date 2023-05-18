import request from 'supertest';
import TestUtils from '../../helpers/helpers';
import models from '../../../src/models';

describe('Token', () => {
  let app;
  let userResponse;
  beforeAll(async () => {
    await TestUtils.startDataBase();
    app = TestUtils.getApp();
  });

  afterAll(async () => {
    await TestUtils.stopDatabase();
  });

  beforeEach(async () => {
    await TestUtils.syncDb();
    userResponse = await TestUtils.registerNewUser();
  });

  describe('requireAuth.middleware', () => {
    it(`Should return a statusCode of 401 if an invalid token is supplied`, async () => {
      const response = await request(app)
        .post('/api/v1/token')
        .set('Authorization', 'Bearer Invalid Token')
        .send()
        .expect(401);

      expect(response.body.success).toBeFalsy();
      expect(response.body.message).toEqual('Invalid token');
    });

    it(`Should return a statusCode of 401 if a malformed token is supplied`, async () => {
      const response = await request(app)
        .post('/api/v1/token')
        .set('Authorization', 'Token Invalid')
        .send()
        .expect(401);

      expect(response.body.success).toBeFalsy();
      expect(response.body.message).toEqual('Bearer Token malformed');
    });

    it(`Should return a statusCode of 401 if no authorization token is supplied`, async () => {
      const response = await request(app).post('/api/v1/token').send().expect(401);

      expect(response.body.success).toBeFalsy();
      expect(response.body.message).toEqual('Auth header not found');
    });
  });

  it(`Should return a statusCode of 200 if a valid token is supplied`, async () => {
    const token = userResponse.data.refreshToken;
    const { body } = await request(app)
      .post('/api/v1/token')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(200);

    expect(body.success).toBeTruthy();
    expect(body.data.accessToken).toEqual(expect.any(String));
  });

  it(`Should return 401 if there is no token doesnt exist`, async () => {
    const { RefreshToken } = models;
    const refreshToken = await RefreshToken.findOne({ where: { token: userResponse.data.refreshToken } });
    refreshToken.token = null;
    await refreshToken.save();
    const { body } = await request(app)
      .post('/api/v1/token')
      .set('Authorization', `Bearer ${userResponse.data.refreshToken}`)
      .send()
      .expect(401);

    expect(body.success).toBeFalsy();
    expect(body.message).toEqual('Please login to continue');
  });

  it(`Should return 401 if there is no token property in  refresh token`, async () => {
    const { RefreshToken } = models;
    await RefreshToken.destroy({ where: { token: userResponse.data.refreshToken } });

    await request(app)
      .post('/api/v1/token')
      .set('Authorization', `Bearer ${userResponse.data.refreshToken}`)
      .send()
      .expect(401);
  });
});
