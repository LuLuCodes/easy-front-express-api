import log4js from '../config/log-config';
import { dateFormat } from './common';
const cloudErrorLog = log4js.getLogger('cloudErrorLog');
const cloudResLog = log4js.getLogger('cloudResLog');

//格式化响应日志
const formatRes = function (url, method, reqData, resData, start, end) {
  var logText = new String();
  //响应日志开始
  logText += '\n' + '*************** response log start ***************' + '\n';

  //添加请求日志
  logText += 'request url: ' + url + '\n';
  logText += 'request method:  ' + method + '\n';
  logText += 'request time: ' + dateFormat(start) + '\n';
  logText += 'request body: ' + '\n' + JSON.stringify(reqData) + '\n';

  //响应内容
  logText += 'response time: ' + dateFormat(end) + '\n';
  logText += 'response body: ' + '\n' + JSON.stringify(resData) + '\n';

  //响应日志结束
  logText += '*************** response log end ***************' + '\n';

  return logText;
};

//格式化错误日志
const formatError = function (url, method, reqData, message, start, end) {
  var logText = new String();

  //错误信息开始
  logText += '\n' + '*************** error log start ***************' + '\n';

  //添加请求日志
  logText += 'request url: ' + url + '\n';
  logText += 'request method: ' + method + '\n';
  logText += 'request time: ' + dateFormat(start) + '\n';
  logText += 'request body: ' + '\n' + JSON.stringify(reqData) + '\n';

  // 响应时间
  logText += 'response time: ' + dateFormat(end) + '\n';
  //错误信息
  logText += 'err message: ' + message + '\n';

  //错误信息结束
  logText += '*************** error log end ***************' + '\n';

  return logText;
};

export default {
  i: function (url, method, reqData, resData, start, end) {
    cloudResLog.info(formatRes(url, method, reqData, resData, start, end));
  },
  e: function (url, method, reqData, message, start, end) {
    cloudErrorLog.error(formatError(url, method, reqData, message, start, end));
  }
};