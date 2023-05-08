import TestUtils from '../utils/helpers';
import models from '../../src/models';

describe('User', () => {
  beforeAll(async () => {
    await TestUtils.startDataBase();
  });

  afterAll(async () => {
    await TestUtils.stopDatabase();
  });

  describe('Static methods', () => {
    describe('hashPassword', () => {
      it(`should return a hashed password`, async () => {
        const { User } = models;
        const testPassword = 'userpass';
        const hashedPassword = await User.hashPassword(testPassword);
        expect(hashedPassword).toEqual(expect.any(String));
        expect(hashedPassword).not.toEqual(testPassword);
      });
    });

    describe('comparePassword', () => {
      it(`Should return true for a valid user password`, async () => {
        const { User } = models;
        const testPassword = 'userpass';
        const hashedPassword = await User.hashPassword(testPassword);
        const isValid = await User.comparePassword(testPassword, hashedPassword);
        expect(isValid).toEqual(true);
      });

      it(`Should return false for an invalid password`, async () => {
        const { User } = models;
        const testPassword = 'userpass';
        const hashedPassword = await User.hashPassword(testPassword);
        const isValid = await User.comparePassword('hello', hashedPassword);
        expect(isValid).toEqual(false);
      });
    });
  });

  describe('Hooks', () => {
    beforeEach(async () => {
      await TestUtils.syncDb();
    });

    describe(`beforeSave`, () => {
      it(`Should create a new user with a hashed password`, async () => {
        const { User } = models;
        const email = 'test@gmail.com';
        const password = 'userpass';
        const username = 'test_user';
        await User.create({ email, password, username });
        let foundUser = await User.findOne({ where: { email: email } });
        foundUser = foundUser.toJSON();
        expect(foundUser).toBeDefined();
        expect(foundUser.email).toEqual(email);
        expect(foundUser.password).not.toEqual(password);
      });
    });
  });
});
