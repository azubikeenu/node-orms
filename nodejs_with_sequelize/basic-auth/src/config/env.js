const environment = {
  port: parseInt(process.env.PORT) || 8080,
  nodeEnv: process.env.NODE_ENV || 'production',
  saltRounds: parseInt(process.env.SALT_ROUNDS) || 10,
  jwtAccessTokenSecret:
    process.env.JWT_ACCESS_TOKEN_SECRET ||
    '50d81146e56820b630eea157610ccf65088897465330dda9d8304fb529ad74554f7b58d3377392f0ae5b962448d2f23f435f3cb061e7b5c2e98ba7161b5f083d',
  jwtRefreshTokenSecret:
    process.env.JWT_REFRESH_TOKEN_SECRET ||
    '0426691fa15d74389f0a1f96f27e82b501751219d5eadd69282046e69c55e2c9af919771182a35770e365ef8605104b06afea140d45fc950f00e1ca243204a9b',
};

export default environment;
