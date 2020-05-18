import { Router } from 'express';
import { ACTION } from '../libs/cloud-req-generator';
import request from '../libs/cloud-request';
import config from '../config/cloud-config';
import md5 from 'crypto-js/md5';

const router = Router();

const { Service } = config;

router.post('/login', async function(req, res /* next */) {
  try {
    const json = req.body;
    if (!json.LoginID) {
      throw new Error('缺少登录参数');
    }
    let action = ACTION(req.headers, req.session, { Body: json });
    let loginResData = await request(
      Service,
      '/BasicAction/Basic/LoginIn',
      action
    );
    if (loginResData.IsSuccess) {
      // 保存session
      const {
        OrganizationList,
        Person,
        User,
      } = loginResData.Data.OrganizationList;

      if (!OrganizationList.length) {
        res.json({
          IsSuccess: false,
          ErrorMsg: '当前手机已被占用，请联系客服处理[code:003]',
        });
        return;
      }

      const OrganizationSysNo = OrganizationList[0].OrganizationSysNo;

      const FaceUrl =
        Person.FileUrlList.length > 0 ? Person.FileUrlList[0] : '';

      const loginData = {
        OrganizationSysNo,
        UserSysNo: User.UserSysNo,
        PersonSysNo: Person.PersonSysNo,
        PersonName: Person.PersonName,
        RealName: Person.RealName,
        FaceUrl,
        CellPhoneNo: Person.CellPhoneNo,
      };
      req.session.loginData = loginData;
      let tokenData = {
        LoginID: loginData.PersonSysNo,
        UserSysNo: loginData.UserSysNo,
      };

      const token_str = `${process.env.APP_COOKIE_KEY}${JSON.stringify(
        tokenData
      )}${process.env.APP_COOKIE_KEY}`;
      const authToken = md5(token_str).toString();

      req.session.authToken = authToken;
      loginData.authToken = authToken;
      res.json({ IsSuccess: true, Data: loginData, ErrorMsg: '' });
    } else {
      // 返回错误
      res.json(loginResData);
    }
  } catch (error) {
    res.json({ IsSuccess: false, ErrorMsg: error.message });
  }
});

router.post('/logout', function(req, res /* next */) {
  req.session.destroy();
  res.json({ IsSuccess: true, ErrorMsg: `` });
});

router.post('/get-auth-token', function(req, res /* next */) {
  res.json({ IsSuccess: true, Data: req.session.authToken, ErrorMsg: `` });
});

router.post('/get-session-user', function(req, res /* next */) {
  res.json({ IsSuccess: true, Data: req.session.loginData, ErrorMsg: `` });
});
export default router;
