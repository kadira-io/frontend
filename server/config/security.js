import helmet from 'helmet'

// added HSTS headers
WebApp.connectHandlers.use(helmet.hsts({
  maxAge: 1000 * 3600 * 24 * 30, // 30 days,
  includeSubdomains: false,
  // preven sending HSTS for Kadira Debug
  // setIf: function(req) {
  //   var host = req.headers["host"];
  //   if(/^debug.kadira.io/.test(host)) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }
}));

// added iexss
WebApp.connectHandlers.use(helmet.xssFilter());

// stop clickjacking
WebApp.connectHandlers.use(helmet.frameguard());
