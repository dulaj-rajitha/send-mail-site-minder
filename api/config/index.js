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
    host: process.env.SENDGRID_MAIL_PROVIDER_HOST,
    key: process.env.SENDGRID_MAIL_PROVIDER_KEY,
  },
  mailMaxRetry: Number(process.env.EMAIL_MAX_RETRY),
};

const store = new confidence.Store(config);

exports.get = (key) => store.get(key);
