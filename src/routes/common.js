import { Router } from 'express';
import { ACTION, QUERY } from '../libs/cloud-req-generator';
import request from '../libs/cloud-request';
import config from '../config/cloud-config';
import allArea from '../data/all-area';
const router = Router();

const { Service } = config;

// 发送验证码
router.post('/SendCaptcha', async function(req, res) {
  try {
    const data = await request(
      Service,
      '/UMAction/Captcha/SendCaptcha',
      ACTION(req.headers, req.session, req.body)
    );
    console.log('SendCaptcha ok:', data);
    res.json(data);
  } catch (e) {
    console.log('SendCaptcha err:', e.message);
    res.json({ IsSuccess: false, ErrorMsg: `${e.message}` });
  }
});

// 检查用户是否存在
router.post('/CheckLoginInStatus2', async function(req, res) {
  try {
    const data = await request(
      Service,
      '/BasicAction/Basic/CheckLoginInStatus2',
      ACTION(req.headers, req.session, req.body)
    );
    res.json(data);
  } catch (e) {
    res.json({ IsSuccess: false, ErrorMsg: `${e.message}` });
  }
});

// 获取省市区(不包含街道)
router.post('/GetAreaList', async function(req, res) {
  try {
    if (
      !req.body.Extra ||
      (req.body.Extra.FatherAreaSysNo === 0 &&
        req.body.Extra.ShowFloorCount >= 2)
    ) {
      res.json({ IsSuccess: true, Data: allArea, ErrorMsg: `` });
      return;
    }
    const data = await request(
      Service,
      '/UMQuery/Area/GetAreaList',
      QUERY(req.headers, req.session, req.body)
    );
    data.Data = JSON.stringify(data.Data, [
      'AreaSysNo',
      'AreaCode',
      'AreaName',
      'ChildAreas',
    ])
      .replace(/AreaSysNo/g, 's')
      .replace(/AreaCode/g, 'd')
      .replace(/AreaName/g, 'n')
      .replace(/ChildAreas/g, 'c');
    data.Data = JSON.parse(data.Data);
    res.json(data);
  } catch (e) {
    res.json({ IsSuccess: false, ErrorMsg: `${e.message}` });
  }
});

// 获取街道
router.post('/GetStreeList', async function(req, res) {
  try {
    req.body.Extra.ShowFloorCount = 2;
    const data = await request(
      Service,
      '/UMQuery/Area/GetAreaList',
      QUERY(req.headers, req.session, req.body)
    );
    data.Data = JSON.stringify(data.Data, [
      'AreaSysNo',
      'AreaCode',
      'AreaName',
      'ChildAreas',
    ])
      .replace(/AreaSysNo/g, 's')
      .replace(/AreaCode/g, 'd')
      .replace(/AreaName/g, 'n')
      .replace(/ChildAreas/g, 'c');
    data.Data = JSON.parse(data.Data);
    res.json(data);
  } catch (e) {
    res.json({ IsSuccess: false, ErrorMsg: `${e.message}` });
  }
});

export default router;
