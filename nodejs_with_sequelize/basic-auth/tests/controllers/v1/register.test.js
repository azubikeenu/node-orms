import request from 'supertest';

import TestUtils from '../../helpers/helpers';

import models from '../../../src/models';

describe('Register', () => {
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

  it(`Should return 201 and register a new user`, async () => {
    const { statusCode } = await request(app)
      .post(`/api/v1/register`)
      .send({ email: 'test@gmail.com', password: 'userpass' });

    const { User } = models;
    const users = await User.findAll();
    expect(statusCode).toBe(201);
    expect(users).toBeDefined();
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@gmail.com');
  });

  it(`Should return a status of 201 and create users with roles`, async () => {
    const { statusCode } = await request(app)
      .post(`/api/v1/register`)
      .send({ email: 'test@gmail.com', password: 'userpass', roles: ['admin', 'user'] });
    const { User, Role } = models;
    const users = await User.findAll({ include: Role });
    expect(statusCode).toBe(201);
    expect(users[0]).toBeDefined();
    expect(users[0]?.Roles).toBeDefined();
    expect(users[0]?.Roles.length).toEqual(2);
    expect(users[0]?.Roles[0].role).toEqual('admin');
    expect(users[0]?.Roles[1].role).toEqual('user');
  });

  it(`Should not create a new user of the email already exists`, async () => {
    await request(app)
      .post(`/api/v1/register`)
      .send({ email: 'test@gmail.com', password: 'userpass', roles: ['admin', 'user'] });

    const { statusCode, body } = await request(app)
      .post(`/api/v1/register`)
      .send({ email: 'test@gmail.com', password: 'userpass', roles: ['admin', 'user'] });

    expect(statusCode).toEqual(409);
    expect(body?.message).toEqual(`User already exists`);
  });
});
