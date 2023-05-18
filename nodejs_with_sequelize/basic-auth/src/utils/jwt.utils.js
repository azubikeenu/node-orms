import jwt from 'jsonwebtoken';
import environment from '../config/env';

class JwtUtils {
  static generateAccessToken(payload, options = {}) {
    const { expiresIn = '1d' } = options;
    return jwt.sign(payload, environment.jwtAccessTokenSecret, {
      expiresIn,
    });
  }

  static generateRefreshToken(payload, options) {
    return jwt.sign(payload, environment.jwtRefreshTokenSecret, {
      ...(options && options),
    });
  }

  static verifyAccessToken(accessToken) {
    return jwt.verify(accessToken, environment.jwtAccessTokenSecret);
  }

  static verifyRefreshToken(refreshToken) {
    return jwt.verify(refreshToken, environment.jwtRefreshTokenSecret);
  }
}

export default JwtUtils;
