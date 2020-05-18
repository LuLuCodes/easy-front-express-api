import { Router } from 'express';
import { EDI_VERIFY, EDI } from '../libs/cloud-req-generator';
import request from '../libs/cloud-request';
import config from '../config/cloud-config';
import { ediVerify } from '../libs/common';
const router = Router();

const { EDIService } = config;

// 微信web网页入口
router.get('/entry', async function(req, res) {
  console.log('entry', req.query.r);
  let prams = {
    responseUrl: req.query.r || 'home',
    type: 0,
    isNeedUserInfo: 0,
  };
  let verify = EDI_VERIFY(req.headers, req.session, 'wxopen_get_OAuthUrl');
  let reqObj = EDI(req.headers, req.session, { Extra: {} });
  reqObj.Extra = ediVerify(prams, verify);
  let edi = await request(EDIService, '/EDIOpen/EDI/GetEDIMsg', reqObj, 15000);
  if (edi.IsSuccess) {
    // console.log('***************返回地址***************');
    // console.log(edi.Data);
    res.redirect(edi.Data);
  } else {
    res.json(edi);
  }
});

router.post('/jssdk', async function(req, res) {
  try {
    if (!req.body.url) {
      throw new Error('url为空');
    }
    let prams = {
      url: req.body.url,
    };
    let verify = EDI_VERIFY(req.headers, req.session, 'wxopen_jsapi_signature');
    let reqObj = EDI(req.headers, req.session, { Extra: {} });
    reqObj.Extra = ediVerify(prams, verify);
    let edi = await request(
      EDIService,
      '/EDIOpen/EDI/GetEDIMsg',
      reqObj,
      15000
    );
    if (edi.IsSuccess && edi.Data) {
      edi.Data = JSON.parse(edi.Data);
    }
    res.json(edi);
  } catch (e) {
    res.json({ IsSuccess: false, ErrorMsg: e.message });
  }
});

export default router;
