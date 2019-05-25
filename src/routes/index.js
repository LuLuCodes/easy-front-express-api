// 不需要csrf和auth的路由
import { Router } from 'express';
import jwt from 'jsonwebtoken';
const router = Router();

router.post('/login', function(req, res /* next */) {
  // 加密，获取token
  const authToken = jwt.sign(
    {
      username: 'username',
      password: 'password'
    },
    process.env.APP_COOKIE_KEY,
    {
      expiresIn: 60 * 60 * 24 // 授权时效24小时
    }
  );
  res.json({ IsSuccess: true, Data: {authToken}, ErrorMsg: `` });
});
export default router;
