const CORS_ALLOWED = [
  'http://localhost:3001',
  'https://heyRene.nomoredomains.monster',
  'https://api.heyRene.nomoredomains.monster',
];

const handleCors = (req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (CORS_ALLOWED.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
};

module.exports = { handleCors };
