import crypto from 'crypto';
import NodeRSA from 'node-rsa';
import path from 'path';
import fs from 'fs';
// const publicPem = fs.readFileSync(path.join(__dirname, '../pem/public.pem'), 'utf-8').toString();
const privatePem = fs.readFileSync(path.join(__dirname, '../pem/private.pem'), 'utf-8').toString();
// const publicKey = new NodeRSA(publicPem);
const privateKey = new NodeRSA(privatePem);
// publicKey.setOptions({ encryptionScheme: 'pkcs1' });
privateKey.setOptions({ encryptionScheme: 'pkcs1' });
export function transArrayToObject(ary, key) {
  let obj = {};
  for (let item of ary) {
    obj[item[key]] = {
      ...item
    };
  }
  return obj;
}

export function transGlobalObject(ary) {
  let obj = {};
  for (let item of ary) {
    obj[item['ParamKey']] = item.ParamValue;
  }
  return obj;
}

export function dateFormat(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
  if (typeof date === 'string') {
    return date;
  }
  let o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt;
}

export function checkSign(req) {
  const privateKey = new NodeRSA(privatePem);
  privateKey.setOptions({ encryptionScheme: 'pkcs1' });

  let req_sign = req.body.S;
  req_sign = privateKey.decrypt(req_sign, 'utf8');
  
  delete req.body.S;
  let sign = JSON.stringify(req.body);
  sign = crypto
    .createHash('md5')
    .update(sign, 'utf8')
    .digest('hex')
    .toUpperCase();

  return req_sign === sign;
}

