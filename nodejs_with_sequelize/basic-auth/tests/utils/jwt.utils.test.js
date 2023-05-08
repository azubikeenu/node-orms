import JwtUtils from '../../src/utils/jwt.utils';
describe('JwtUtils', () => {
  describe('accessTokens', () => {
    it(`Should generate a valid access token`, () => {
      const accessToken = JwtUtils.generateAccessToken({ username: 'Richard' });
      expect(accessToken).toEqual(expect.any(String));
    });

    it(`Should verify a valid access token`, async () => {
      const accessToken = JwtUtils.generateAccessToken({ username: 'Richard' });
      const token = JwtUtils.verifyAccessToken(accessToken);
      expect(token).toBeDefined();
    });
  });
});
