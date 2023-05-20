const CORS_ALLOWED = [
  'https://api.heyRene.nomoredomains.monster',
  'https://heyRene.nomoredomains.monster',
];
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const cors = (req, res, next) => {
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  res.header('Access-Control-Allow-Origin', '*');

  next();
};

module.exports = { cors };
