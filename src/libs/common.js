import crypto from 'crypto';
// import NodeRSA from 'node-rsa';
// import path from 'path';
// import fs from 'fs';
import CryptoJS from 'crypto-js';
// const privatePem = fs.readFileSync(path.join(__dirname, '../pem/private.pem'), 'utf-8').toString();
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

// NodeRSA...
// export function checkSign(req) {
//   try {
//     let privateKey = new NodeRSA(privatePem, 'private', {
//       encryptionScheme: 'pkcs1'
//     });
  
//     let req_sign = req.body.S;
//     req_sign = Buffer.from(req_sign, 'base64').toString().replace(/%$#%/g,"+");
//     req_sign = privateKey.decrypt(req_sign, 'utf8');
  
//     delete req.body.S;
//     let sign = JSON.stringify(req.body);
//     sign = crypto
//       .createHash('md5')
//       .update(sign, 'utf8')
//       .digest('hex')
//       .toUpperCase();
  
//     return req_sign === sign;
//   } catch(e) {
//     console.error('req.body: ', JSON.stringify(req.body));
//     return false;
//   }
// }

export function checkSign(req) {
  try {
    let req_sign = CryptoJS.AES.decrypt(req.body.S, req.path);
    req_sign= req_sign.toString(CryptoJS.enc.Utf8);
    delete req.body.S;
    let sign = JSON.stringify(req.body);
    sign = crypto
      .createHash('md5')
      .update(sign, 'utf8')
      .digest('hex')
      .toUpperCase();
  
    return req_sign === sign;
  } catch(e) {
    console.error('req.body: ', JSON.stringify(req.body));
    return false;
  }
}