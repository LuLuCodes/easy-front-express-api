import log4js from './config/log-config';

const errorLog = log4js.getLogger('errorLog'); //此处使用category的值
const resLog = log4js.getLogger('responseLog'); //此处使用category的值

const log = {};
log.i = function(req, res, resTime) {
  if (req) {
    resLog.info(formatRes(req, res, resTime));
  }
};

log.e = function(ctx, error, resTime) {
  if (ctx && error) {
    errorLog.error(formatError(ctx, error, resTime));
  }
};

//格式化请求日志
const formatReqLog = function(req, resTime) {

  let getClientIp = function (req) {
    return req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress;
  };
  let ip = getClientIp(req).match(/\d+.\d+.\d+.\d+/);

  var logText = new String();
  //访问方法
  var method = req.method;
  logText += 'request method: ' + method + '\n';
  //请求原始地址

  logText += 'request originalUrl:  ' + req.originalUrl + '\n';
  //客户端ip
  logText += 'request client ip:  ' + ip + '\n';
  
  //请求参数
  if (method === 'GET') {
    logText += 'request query:  ' + JSON.stringify(req.query) + '\n';
  } else {
    logText += 'request body: ' + '\n' + JSON.stringify(req.body) + '\n';
  }

  //服务器响应时间
  logText += 'response time: ' + resTime + '\n';

  return logText;
};

//格式化响应日志
const formatRes = function(req, res, resTime) {
  var logText = new String();
  //响应日志开始
  logText += '\n' + '*************** response log start ***************' + '\n';

  //添加请求日志
  logText += formatReqLog(req, resTime);

  //响应状态码
  logText += 'response status: ' + res.statusCode + '\n';

  //响应内容
  logText += 'response body: ' + '\n' + JSON.stringify(res.body) + '\n';

  //响应日志结束
  logText += '*************** response log end ***************' + '\n';

  return logText;
};

//格式化错误日志
const formatError = function(ctx, err, resTime) {
  var logText = new String();

  //错误信息开始
  logText += '\n' + '*************** error log start ***************' + '\n';

  //添加请求日志
  logText += formatReqLog(ctx, resTime);

  //错误名称

  logText += 'err name: ' + err.name + '\n';
  //错误信息

  logText += 'err message: ' + err.message + '\n';
  //错误详情

  logText += 'err stack: ' + err.stack + '\n';

  //错误信息结束
  logText += '*************** error log end ***************' + '\n';

  return logText;
};

module.exports = log;