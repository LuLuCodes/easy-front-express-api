import  cloudConfig from '../config/cloud-config';
import { QUERY } from '../libs/cloud-req-generator';
import request from '../libs/cloud-request';
import { transArrayToObject } from '../libs/common';

const { Service } = cloudConfig;

export default async function () {
  const globalData = await request(Service, '/BasicQuery/Basic/GetGlobalConfigs', QUERY(null, null, {
    Extra: {
      SaasKey: ''
    }
  }));
  if (globalData.IsSuccess) {
    global.GlobalConfigs = transArrayToObject(globalData.Data.GlobalConfigs, 'ParamKey');
  }
}