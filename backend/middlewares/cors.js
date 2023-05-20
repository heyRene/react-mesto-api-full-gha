const CORS_ALLOWED = [
  'http://localhost:3000',
  'https://heyRene.nomoredomains.monster',
  'https://api.heyRene.nomoredomains.monster',
];

const handleCors = {
  credentials: true,
  origin: function checkCorsList(origin, callback) {
    if (CORS_ALLOWED.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

module.exports = { handleCors };
