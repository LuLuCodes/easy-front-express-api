import { Router } from 'express';
import oss from 'ali-oss';
import formidable from 'formidable';
import fs from 'fs-extra';
import path from 'path';

const router = Router();
const uploadDir = path.resolve(__dirname, '../temp-files');
fs.ensureDirSync(uploadDir);
// 发送验证码
router.post('/upload-oss', async function(req, res) {
  try {
    let oss_client = new oss({
      region: global.GlobalConfigs.regionId.ParamValue,
      accessKeyId: global.GlobalConfigs.accessKeyId.ParamValue,
      accessKeySecret: global.GlobalConfigs.accessKeySecret.ParamValue,
      bucket: global.GlobalConfigs.bucketName.ParamValue,
      secure: true,
      cname: global.GlobalConfigs.DomainUrl && global.GlobalConfigs.DomainUrl.ParamValue ? true : false,
      internal: process.env.NODE_ENV === 'production'
    });
    if (global.GlobalConfigs.DomainUrl && global.GlobalConfigs.DomainUrl.ParamValue) {
      oss_client.endpoint = global.GlobalConfigs.DomainUrl.ParamValue;
    }
    let form = new formidable.IncomingForm();
    form.uploadDir = uploadDir;
    //设置文件上传之后是否保存文件后缀，默认是不保存
    form.keepExtensions = true;
    form.maxFieldSize = 20 * 1024 * 1024;
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.json({ IsSuccess: false, ErrorMsg: `文件解析失败` });
        return;
      }
      let keys = Object.keys(files);
      if (keys.length === 0) {
        res.json({ IsSuccess: false, ErrorMsg: `请上传文件` });
        return;
      }
      let promises = keys.map(key => {
        let file = files[key];
        let filename = file.name;
        filename =  Math.random().toString().slice(2) + '_' +filename;
        return oss_client.putStream(`${fields.path || ''}${filename}`, fs.createReadStream(file.path));
      });
      let results = await Promise.all(promises);
      let urls = results.map(result => result.url);
      res.json({ IsSuccess: true, Data: urls });
    });
  } catch (e) {
    res.json({ IsSuccess: false, ErrorMsg: `${e.message}` });
  }
});

export default router;
