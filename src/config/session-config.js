export default {
  cookie: { secure: false, maxAge: 3 * 24 * 3600 * 1000, httpOnly: true },
  redis: {
    host: '127.0.0.1',
    port: 6379,
    db: 15
  },
  secret: process.env.APP_COOKIE_KEY || 'MYun 123!@# web',
  key: process.env.APP_COOKIE_KEY || 'express-api'
};
