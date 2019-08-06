import { Router } from 'express';
import oss from 'ali-oss';
import formidable from 'formidable';
import fs from 'fs-extra';
import path from 'path';

const router = Router();
const tempFilesOssDir = path.resolve(__dirname, '../temp-files-oss');
fs.ensureDirSync(tempFilesOssDir);

let oss_client = null;

function createOSSClient() {
  oss_client = new oss({
    region: global.GlobalConfigs.regionId.ParamValue,
    accessKeyId: global.GlobalConfigs.accessKeyId.ParamValue,
    accessKeySecret: global.GlobalConfigs.accessKeySecret.ParamValue,
    bucket: global.GlobalConfigs.bucketName.ParamValue,
    secure: true,
    endpoint: global.GlobalConfigs.endpoint.ParamValue,
    internal: process.env.NODE_ENV === 'production'
  });
}

function uploadFileOSS(file, oss_path) {
  if (!oss_client) {
    createOSSClient();
  }
  let filename = file.name;
  filename =
    Math.random()
      .toString()
      .slice(2) +
    '_' +
    filename;
  return oss_client.putStream(`${oss_path || ''}${filename}`, fs.createReadStream(file.path));
}
// 上传文件至OSS
router.post('/upload-file-oss', async function(req, res) {
  try {
    let form = new formidable.IncomingForm({
      uploadDir: tempFilesOssDir,
      //设置文件上传之后是否保存文件后缀，默认是不保存
      keepExtensions: true,
      maxFieldSize: 20 * 1024 * 1024,
      multiples: true
    });
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

      let oss_path = fields.oss_path || '';
      if (oss_path[0] === '/') {
        oss_path = oss_path.substring(1, oss_path.length - 1);
      }
      if (oss_path[oss_path.length - 1] !== '/') {
        oss_path += '/';
      }
      let uploadPromises = [];
      let delPromises = [];
      if (keys.length === 1 && keys[0] === '') {
        if (Array.isArray(files[''])) {
          let file_list = files[''];
          for (let file of file_list) {
            let put = uploadFileOSS(file, oss_path);
            let del = fs.remove(file.path);
            uploadPromises.push(put);
            delPromises.push(del);
          }
        } else {
          let file = files[''];
          let put = uploadFileOSS(file, oss_path);
          let del = fs.remove(file.path);
          uploadPromises.push(put);
          delPromises.push(del);
        }
      } else {
        keys.map(key => {
          let file = files[key];
          let put = uploadFileOSS(file, oss_path);
          let del = fs.remove(file.path);
          uploadPromises.push(put);
          delPromises.push(del);
        });
      }

      let results = await Promise.all(uploadPromises);
      let urls = results.map(result => {
        if (global.GlobalConfigs && global.GlobalConfigs.DomainUrl && global.GlobalConfigs.DomainUrl.ParamValue) {
          // cdn地址
          return result.url.replace(/( http|https):\/\/(.*?)\//g, global.GlobalConfigs.DomainUrl.ParamValue);
        } else {
          return result.url;
        }
      });
      await Promise.all(delPromises);
      res.json({ IsSuccess: true, Data: urls });
    });
  } catch (e) {
    res.json({ IsSuccess: false, ErrorMsg: `${e.message}` });
  }
});

router.post('/upload-base64-oss', async function(req, res) {
  try {
    if (!oss_client) {
      createOSSClient();
    }
    let fileData = req.body.fileData;
    let fileName = req.body.fileName || '';
    let filePath = req.body.filePath || '';
    if (!fileData) {
      res.json({ IsSuccess: false, ErrorMsg: `缺少参数` });
      return;
    }

    if (filePath[0] === '/') {
      filePath = filePath.substring(1, filePath.length - 1);
    }
    if (filePath[filePath.length - 1] !== '/') {
      filePath += '/';
    }

    
    const base64 = fileData.split(',').pop();
    const fileType = fileData
      .split(';')
      .shift()
      .split(':')
      .pop()
      .split('/')
      .pop().split('.')
      .pop();
    const dataBuffer = new Buffer(base64, 'base64');

    fileName =
            Math.random()
              .toString()
              .slice(2) + `${fileName ? '_' + fileName : ''}` + `.${fileType}`;

    // 文件名
    const oss_path = `${filePath}${fileName}`;
    let put = await oss_client.put(oss_path, dataBuffer);
    if (global.GlobalConfigs && global.GlobalConfigs.DomainUrl && global.GlobalConfigs.DomainUrl.ParamValue) {
      // cdn地址
      res.json({ IsSuccess: true, Data: put.url.replace(/( http|https):\/\/(.*?)\//g, global.GlobalConfigs.DomainUrl.ParamValue)});
    } else {
      res.json({ IsSuccess: true, Data: put.url });
    }
  } catch (e) {
    res.json({ IsSuccess: false, ErrorMsg: `${e.message}` });
  }
});
export default router;
