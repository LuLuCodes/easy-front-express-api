import './env';

import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import session from 'express-session';
import connectRedis from 'connect-redis';
import expressJwt from 'express-jwt';

import sessionConfig from './config/session-config';
import corsConfig from './config/cors-config';
// import auth_middleware from './middleware/auth';
import cloud_global from './middleware/cloud-global';
import log from './log';
import { checkSign } from './libs/common';
import index from './routes/index';
import user from './routes/user';

const RedisStore = connectRedis(session);

const app = express();
cloud_global();

app.locals.title = process.env.APP_NAME;
app.locals.version = process.env.APP_VERSION;

app.use(cors(corsConfig));
app.use(helmet());
app.use(compression());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser(process.env.APP_COOKIE_KEY));

app.use(
  session({
    store: new RedisStore(sessionConfig.redis),
    secret: sessionConfig.secret,
    key: sessionConfig.key,
    cookie: sessionConfig.cookie,
    resave: true,
    rolling: true,
    saveUninitialized: false
  })
);

// logger
app.post('*', async (req, res, next) => {
  //响应开始时间
  const start = new Date();
  try {
    //开始进入到下一个中间件
    await next();
    //记录响应日志
    log.i(req, res, new Date() - start);
  } catch (error) {
    //记录异常日志
    log.e(req, error, new Date() - start);
  }
});

// 处理webpack服务请求
app.get('/__webpack_hmr', function(req, res) {
  res.send('');
});

// jwt中间件
app.use(
  expressJwt({
    secret: process.env.APP_COOKIE_KEY // 加密密钥，可换
  }).unless({
    path: ['/login'] // 添加不需要token的接口
  })
);

// 验证签名
app.post('*', async (req, res, next) => {
  if (!process.env.APP_ENABLE_SIGN) {
    next();
    return;
  }
  if (!req.body.S) {
    res.status(403);
    res.json({
      message: '缺少签名参数',
      error: {}
    });
    return;
  }
  if (!checkSign(req)) {
    res.status(403);
    res.json({
      message: '非法签名参数',
      error: {}
    });
    return;
  }

  next();
});

app.use('/', index);
app.use('/user', user);

app.use(function(err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  // CSRF验证失败
  res.status(403);
  res.json({
    message: err.message,
    error: process.env.NODE_ENV === 'debug' ? err : {}
  });
});

// 未携带token请求接口会出错，触发这个
app.use(function(err, req, res, next) {
  if (err.name !== 'UnauthorizedError') return next(err);
  // token验证失败
  res.status(401);
  res.json({
    message: err.message,
    error: process.env.NODE_ENV === 'debug' ? err : {}
  });
});

// catch 404 and forward to error handler
app.use(function(req, res /* next */) {
  const err = new Error('Not Found');
  err.status = 404;
  res.status(err.status);
  res.json({
    message: err.message,
    error: process.env.NODE_ENV === 'debug' ? err : {}
  });
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function(err, req, res /* next */) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: process.env.NODE_ENV === 'debug' ? err : {}
  });
});

export default app;
