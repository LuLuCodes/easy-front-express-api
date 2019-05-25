export default {
  cookie: { secure: false, maxAge: 3 * 24 * 3600 * 1000, httpOnly: true },
  redis: {
    host: '127.0.0.1',
    port: 6379,
    db: 15
  },
  secret: 'MYun 123!@# web',
  key: 'express-api'
};
