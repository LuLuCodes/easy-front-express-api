const white_list = [];
const isDebug = process.env.NODE_ENV === 'debug';
const baseOptions = {
  credentials: true,
  methods: ['PUT', 'POST', 'GET', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Content-Length',
    'Accept',
    'x-forwarded-for',
    'Authorization'
  ]
};

export default function (req, callback) {
  let corsOptions;
  if (white_list.indexOf(req.header('Origin')) !== -1 || isDebug) {
    corsOptions = {
      origin: '*', // req.header('Origin')
      ...baseOptions
    }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = {
      origin: false,
      ...baseOptions
    }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
}