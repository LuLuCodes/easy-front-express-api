/**
 * 路由鉴权中间件
 *
 */

// 白名单
import md5 from 'crypto-js/md5';
const white_list = [
  '/user/login',
  '/user/get-auth-token',
  '/upload/upload-file-oss',
  '/upload/upload-base64-oss',
  '/common/SendCaptcha',
  '/common/GetAreaList',
  '/common/GetStreeList',
  '/common/CheckLoginInStatus2',
];

export default function(req, res, next) {
  if (req.method === 'POST') {
    if (white_list.indexOf(req.originalUrl) !== -1) {
      next();
    } else if (!req.session.authToken) {
      res.status(401);
      res.json({
        IsSuccess: false,
        ErrorMsg: `No authorization token was found`,
      });
      return;
    } else {
      let token_data = {
        LoginID: req.session.LoginID,
        UserSysNo: req.session.UserSysNo,
      };
      let token_str = `${process.env.APP_COOKIE_KEY}${JSON.stringify(
        token_data
      )}${process.env.APP_COOKIE_KEY}`;
      let authToken = md5(token_str).toString();
      if (req.session.authToken !== authToken) {
        res.status(403);
        res.json({ IsSuccess: false, ErrorMsg: `Forbiddend` });
        return;
      } else {
        next();
      }
    }
  } else {
    next();
  }
}
