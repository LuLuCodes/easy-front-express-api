/**
 * 云端请求生成器V2
 * 说明：新版云端请求生成器，支持Conditions查询操作，让的查询更加灵活
 */
const package_conditions = require('./cloud-condition/condition-assembler');
import config from '../config/cloud-config';
const { CompanyCode, BizCompanyCode } = config;

export function QUERY(headers, session, body) {
  let query = {
    CompanyCode,
    UserSysNo: 1,
    Extra: { BizCompanyCode },
    Filters: [],
    Sorts: [],
    PageIndex: body.PageIndex || 0,
    PageSize: body.PageSize || 0,
  };

  if (session && session.User && session.User.UserSysNo) {
    query.UserSysNo = session.User.UserSysNo;
  }
  if (headers && headers['bizcompanycode']) {
    query.Extra.BizCompanyCode = parseInt(headers['bizcompanycode']);
  } else if (session && session.BizCompanyCode) {
    query.Extra.BizCompanyCode = session.BizCompanyCode;
  }
  if (headers && headers['companycode']) {
    query.CompanyCode = parseInt(headers['companycode']);
  } else if (session && session.CompanyCode) {
    query.CompanyCode = session.CompanyCode;
  }
  query.Extra = { ...query.Extra, ...body.Extra };
  if (body.Filters) {
    query.Filters = body.Filters;
  }
  if (body.Sorts) {
    query.Sorts = body.Sorts;
  }
  if (body.KeySysNo) {
    query.KeySysNo = body.KeySysNo;
  }
  if (body.Where) {
    query.Conditions = package_conditions(body.Where);
  }
  return query;
}

export function ACTION(headers, session, body) {
  let action = {
    CompanyCode,
    UserSysNo: 1,
    Body: { BizCompanyCode },
  };
  if (session && session.User && session.User.UserSysNo) {
    action.Body.UserSysNo = session.User.UserSysNo;
  }

  if (headers && headers['bizcompanycode']) {
    action.Body.BizCompanyCode = parseInt(headers['bizcompanycode']);
  } else if (session && session.BizCompanyCode) {
    action.Body.BizCompanyCode = session.BizCompanyCode;
  }
  if (headers && headers['companycode']) {
    action.CompanyCode = parseInt(headers['companycode']);
  } else if (session && session.CompanyCode) {
    action.CompanyCode = session.CompanyCode;
  }
  action.Body = { ...action.Body, ...body.Body };
  return action;
}

export function EDI_VERIFY(headers, session, type) {
  let verify = {
    CompanyCode,
    MyAppKey: global.GlobalConfigs.MyAppKey.ParamValue,
    MyAppToken: global.GlobalConfigs.MyAppToken.ParamValue,
    MyAppSecret: global.GlobalConfigs.MyAppSecret.ParamValue,
    EDIType: type,
  };
  if (headers && headers['companycode']) {
    verify.CompanyCode = parseInt(headers['companycode']);
  } else if (session && session.CompanyCode) {
    verify.CompanyCode = session.CompanyCode;
  }
  return verify;
}

export function EDI(headers, session, body) {
  let query = {
    CompanyCode,
    UserSysNo: 1,
    Extra: {},
  };
  if (session && session.User && session.User.UserSysNo) {
    query.UserSysNo = session.User.UserSysNo;
  }
  if (headers && headers['bizcompanycode']) {
    query.Extra.BizCompanyCode = parseInt(headers['bizcompanycode']);
  } else if (session && session.BizCompanyCode) {
    query.Extra.BizCompanyCode = session.BizCompanyCode;
  }
  if (headers && headers['companycode']) {
    query.CompanyCode = parseInt(headers['companycode']);
  } else if (session && session.CompanyCode) {
    query.CompanyCode = session.CompanyCode;
  }
  query.Extra = { ...query.Extra, ...body.Extra };
  return query;
}
