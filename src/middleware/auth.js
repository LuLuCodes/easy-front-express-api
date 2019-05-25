/**
 * 路由鉴权中间件
 *
 */

// 白名单
const white_list = [
  '/user/GetUserInfo',
  '/user/GetUserInfo1'
];

export default function (req, res, next) {
  if (req.method === 'POST') {
    if (req.session.Token || white_list.indexOf(req.originalUrl) !== -1) {
      next();
    } else {
      return res.sendStatus(401);
    }
  } else {
    next();
  }
}