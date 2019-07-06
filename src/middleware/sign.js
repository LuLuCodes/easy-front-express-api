/**
 * 验签中间件
 *
 */

// 白名单
import { checkSign } from '../libs/common';
const white_list = [
  '/upload/upload-file-oss'
];

export default function(req, res, next) {
  if (req.method !== 'POST') {
    next();
    return;
  }
  if (white_list.indexOf(req.originalUrl) !== -1 || !process.env.APP_ENABLE_SIGN) {
    next();
    return;
  }
  if (!req.body.S) {
    res.status(403);
    res.json({
      message: '缺少签名参数',
      error: {}
    });
    return;
  }

  if (!checkSign(req)) {
    res.status(403);
    res.json({
      message: '非法签名参数',
      error: {}
    });
    return;
  }

  next();
}
