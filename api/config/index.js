require('dotenv').config();
const confidence = require('confidence');

const config = {
  port: process.env.PORT,
  logLevel: process.env.LOG_LEVEL,
  sendGrid: {
    host: process.env.SENDGRID_MAIL_PROVIDER_HOST,
    path: process.env.SENDGRID_MAIL_PROVIDER_PATH,
    key: process.env.SENDGRID_MAIL_PROVIDER_KEY,
  },
  mailGun: {
    host: process.env.MAILGUN_MAIL_PROVIDER_HOST,
    path: process.env.MAILGUN_MAIL_PROVIDER_PATH,
    key: process.env.MAILGUN_MAIL_PROVIDER_KEY,
    boundary: '----WebKitFormBoundary7MA4YWxkTrZu0gW',
  },
  mailMaxRetry: Number(process.env.EMAIL_MAX_RETRY),
};

const store = new confidence.Store(config);

exports.get = (key) => store.get(key);
