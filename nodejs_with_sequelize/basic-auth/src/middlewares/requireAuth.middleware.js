import JwtUtils from '../utils/jwt.utils';

function requireAuth(tokenType = 'accessToken') {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      try {
        var [bearer, token] = authHeader.split(' ');
        if (bearer.toLowerCase() !== 'bearer' || !token) {
          throw Error;
        }
      } catch (error) {
        return res.status(401).send({ success: false, message: 'Bearer Token malformed' });
      }
    } else {
      return res.status(401).send({ success: false, message: 'Auth header not found' });
    }

    // verify the token
    try {
      let jwt;
      switch (tokenType) {
        case 'refreshToken':
          jwt = JwtUtils.verifyRefreshToken(token);
          break;
        case 'accessToken':
        default:
          jwt = JwtUtils.verifyAccessToken(token);
      }
      req.body.jwt = jwt;
      return next();
    } catch (err) {
      return res.status(401).send({ success: false, message: 'Invalid token' });
    }
  };
}

export default requireAuth;
