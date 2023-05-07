module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'userpass',
    port: parseInt(process.env.DB_PORT) || 5432,
    host: process.env.DB_HOST || '127.0.0.1',
    dbName: process.env.DB_NAME || 'auth_db',
  },

  test: {
    port: parseInt(process.env.DB_TEST_PORT) || 5433,
    host: process.env.DB_TEST_HOST || '127.0.0.1',
    dbName: process.env.DB_TEST_NAME || 'auth_db_test',
  },
};
