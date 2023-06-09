import request from 'supertest';
import TestUtils from '../../helpers/helpers';
import models from '../../../src/models';

describe('Login', () => {
  let app;
  let response;
  beforeAll(async () => {
    await TestUtils.startDataBase();
    app = TestUtils.getApp();
  });

  afterAll(async () => {
    await TestUtils.stopDatabase();
  });

  beforeEach(async () => {
    await TestUtils.syncDb();
    response = await TestUtils.registerNewUser();
  });

  it(`Should return a statusCode of 200 and have an access token and refresh token when valid credentials are supplied `, async () => {
    const { body, statusCode } = await request(app).post('/api/v1/login').send({
      email: TestUtils.email,
      password: TestUtils.password,
    });
    expect(statusCode).toEqual(200);
    expect(body.success).toBeTruthy();
    expect(body.data.accessToken).toEqual(expect.any(String));
    expect(body.data.refreshToken).toEqual(expect.any(String));
  });

  it(`Should store the refresh token in the database on successful login`, async () => {
    const { RefreshToken } = models;
    const { body } = await request(app).post('/api/v1/login').send({
      email: TestUtils.email,
      password: TestUtils.password,
    });
    let token = body.data.refreshToken;
    expect(token).toBeDefined();
    const savedToken = await RefreshToken.findOne({ where: { token } });
    expect(savedToken).toBeDefined();
    expect(savedToken.token).toEqual(token);
  });
  it(`Should return a statusCode of 401 if the user is not found`, async () => {
    const { statusCode, body } = await request(app).post('/api/v1/login').send({
      email: 'dummy@gmail.com',
      password: TestUtils.password,
    });

    expect(statusCode).toEqual(400);
    expect(body.success).toBeFalsy();
  });

  it(`Should return the savedRefresh token if the user is already registered`, async () => {
    const { body } = await request(app).post('/api/v1/login').send({
      email: TestUtils.email,
      password: TestUtils.password,
    });
    expect(body.data.refreshToken).toEqual(response.data.refreshToken);
  });

  it(`Should create a new refresh token if no refresh token is associated to the user`, async () => {
    const { RefreshToken } = models;
    await RefreshToken.destroy({ where: {} });

    let refreshTokens = await RefreshToken.findAll();

    expect(refreshTokens.length).toEqual(0);

    await request(app).post('/api/v1/login').send({
      email: TestUtils.email,
      password: TestUtils.password,
    });

    refreshTokens = await RefreshToken.findAll();
    expect(refreshTokens.length).toEqual(1);
  });

  it(`Should update the refresh token if it has no token value `, async () => {
    const { RefreshToken, User } = models;
    const resultSet = await RefreshToken.update(
      { token: null },
      { where: { token: response.data.refreshToken }, returning: true, raw: true }
    );

    const updatedToken = resultSet[1][0];
    expect(updatedToken.token).toEqual(null);

    await request(app).post('/api/v1/login').send({
      email: TestUtils.email,
      password: TestUtils.password,
    });
    const user = await User.findOne({ where: { email: TestUtils.email }, include: RefreshToken });
    expect(user.RefreshToken.token).toEqual(expect.any(String));
  });
});
