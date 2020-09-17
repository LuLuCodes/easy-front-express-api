export default {
  cookie: { secure: false, maxAge: 3 * 24 * 3600 * 1000, httpOnly: true },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    db: process.env.COOKIE_REDIS_DB_INDEX || 0,
  },
  secret: process.env.COOKIE_SECRET || 'express-front-express-api',
  key: process.env.COOKIE_KEY || 'express-front-express-api',
};
