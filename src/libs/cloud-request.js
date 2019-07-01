import axios from 'axios';
import log from './cloud-log';

export default async function (config, url, json, timeout = 25000) {
  if (!config || !url || !json) {
    throw new Error('缺少必要参数');
  }
  const baseURL = `http://${config.IP}:${config.Port}`;
  let start = new Date();
  try {
    let res = await axios({
      method: 'post',
      baseURL,
      timeout: timeout,
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      url: url,
      data: json
    });
    let end = new Date();
    let data = res.data;
    if (!data) {
      log.e(baseURL, url, json, '云端未返回data', start, end);
      return { IsSuccess: false, ErrorMsg: `后端无响应` };
    }
    if (data.HasError) {
      log.e(baseURL, url, json, data.Fault.ErrorDescription, start, end);
      return { IsSuccess: false, ErrorMsg: `${data.Fault.ErrorDescription}` };
    }
    log.i(baseURL, url, json, data, start, end);
    return {IsSuccess: true, Data: data.Body, Paging: data.Paging};
  } catch (error) {
    let end = new Date();
    log.e(baseURL, url, json, error.message, start, end);
    return { IsSuccess: false, ErrorMsg: `${error.message}` };
  }
}
