'use strict';
const config_dev = {
  CompanyCode: process.env.COMPANY_CODE,
  BizCompanyCode: process.env.BIZCOMPANY_CODE,
  Service: {
    IP: process.env.CLOUD_SERVICE_HOST,
    Port: process.env.CLOUD_SERVICE_PORT,
  },
  EDI: {
    IP: process.env.CLOUD_EDI_HOST,
    Port: process.env.CLOUD_EDI_PORT,
    Verify: {
      MyVersion: 'V2',
    },
  },
};

const config_pro = {
  CompanyCode: process.env.COMPANY_CODE,
  BizCompanyCode: process.env.BIZCOMPANY_CODE,
  Service: {
    IP: process.env.CLOUD_SERVICE_HOST,
    Port: process.env.CLOUD_SERVICE_PORT,
  },
  EDI: {
    IP: process.env.CLOUD_EDI_HOST,
    Port: process.env.CLOUD_EDI_PORT,
    Verify: {
      MyVersion: 'V2',
    },
  },
};

export default process.env.NODE_ENV === 'production' ? config_pro : config_dev;
