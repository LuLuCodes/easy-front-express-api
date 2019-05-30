import crypto from 'crypto';
import _ from 'lodash';
import NodeRSA from 'node-rsa';
import path from 'path';
import fs from 'fs';
const publicPem = fs.readFileSync(path.join(__dirname, '../pem/public.pem'), 'utf-8').toString();
const privatePem = fs.readFileSync(path.join(__dirname, '../pem/private.pem'), 'utf-8').toString();
const publicKey = new NodeRSA(publicPem);
const privateKey = new NodeRSA(privatePem);
publicKey.setOptions({ encryptionScheme: 'pkcs1' });
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

export function sign(secret, params) {
  const keys = _.keys(params);
  keys.sort();
  let s1 = secret;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = typeof params[key] === 'object' ? JSON.stringify(params[key]) : params[key];
    s1 += `${key}=${value}${i < keys.length - 1 ? '&' : ''}`;
  }
  s1 += secret;
  const sign = crypto
    .createHash('md5')
    .update(s1, 'utf8')
    .digest('hex')
    .toUpperCase();

  return sign;
}

// 私钥解密
export function privateKeyDecrypt(params, toObject = true) {
  try {
    const decrypt_data = privateKey.decrypt(params, 'utf8');
    return toObject ? JSON.parse(decrypt_data) : decrypt_data;
  } catch (e) {
    throw e;
  }
}

// 私钥加密
export function privateKeyEncrypt(params) {
  try {
    if (typeof params === 'object') {
      return privateKey.encrypt(JSON.stringify(params), 'base64');
    } else {
      return privateKey.encrypt(params, 'base64');
    }
  } catch (e) {
    throw e;
  }
}

// 公钥解密
export function publicKeyDecrypt(params, toObject = true) {
  try {
    const decrypt_data = publicKey.decrypt(params, 'utf8');
    return toObject ? JSON.parse(decrypt_data) : decrypt_data;
  } catch (e) {
    throw e;
  }
}

// 公钥加密
export function publicKeyEncrypt(params) {
  try {
    if (typeof params === 'object') {
      return publicKey.encrypt(JSON.stringify(params), 'base64');
    } else {
      return publicKey.encrypt(params, 'base64');
    }
  } catch (e) {
    throw e;
  }
}
