import { Router } from 'express';
import md5 from 'crypto-js/md5';
// import jwt from 'jsonwebtoken';
const router = Router();

router.post('/login', function(req, res /* next */) {
  // 完成登录, 获取用户信息
  // res.session.LoginID = LoginID;
  // res.session.UserSysNo = UserSysNo;
  // 加密，获取token
  let token_data = {
    LoginID: 'LoginID',
    UserSysNo: 'UserSysNo'
  };
  let token_str = `${process.env.APP_COOKIE_KEY}${JSON.stringify(token_data)}${process.env.APP_COOKIE_KEY}`;
  let authToken = md5(token_str).toString();
  res.session.authToken = authToken;
  res.json({ IsSuccess: true, ErrorMsg: `` });
});

router.post('/logout', function(req, res /* next */) {
  req.session.destroy();
  res.json({ IsSuccess: true, ErrorMsg: `` });
});

router.post('/get-auth-token', function(req, res /* next */) {
  res.json({ IsSuccess: true, Data: req.session.authToken, ErrorMsg: `` });
});
export default router;
