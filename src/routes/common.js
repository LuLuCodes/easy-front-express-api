import { Router } from 'express';
import { ACTION } from '../libs/cloud-req-generator';
import request from '../libs/cloud-request';
import  config from '../config/cloud-config';
const router = Router();

const { Service } = config;

// 发送验证码
router.post('/SendCaptcha', async function (req, res) {
  try {
    const data = await request(Service, '/UMAction/Captcha/SendCaptcha', ACTION(req.headers, req.session, req.body));
    console.log('SendCaptcha ok:', data);
    res.json(data);
  } catch(e) {
    console.log('SendCaptcha err:', e.message);
    res.json({ IsSuccess: false, ErrorMsg: `${e.message}` });
  }
});

// 检查用户是否存在
router.post('/CheckLoginInStatus2', async function (req, res) {
    try {
        const data = await request(Service, '/BasicAction/Basic/CheckLoginInStatus2', ACTION(req.headers, req.session, req.body));
        res.json(data);
    } catch(e) {
        res.json({ IsSuccess: false, ErrorMsg: `${e.message}` });
    }
});


export default router;