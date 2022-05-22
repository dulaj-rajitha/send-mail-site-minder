const mailMaxRetry = require('../config').get('/mailMaxRetry');
const Logger = require('../helpers/logger');

const logger = new Logger('email service');

const SendGridMailProvider = require('../resources/sendGridMailProvider');
const MailGunMailProvider = require('../resources/mailGunMailProvider');

// mock connection pool with multiple providers
const mailProviderPool = [new SendGridMailProvider(),
  new SendGridMailProvider(), new SendGridMailProvider(), new MailGunMailProvider()];

// keep a round-robin index for the next eligible provider
let nextProvider = 0;

const sendWithProvider = async ({
  from, to, cc, bcc, subject, text,
}, attempts) => {
  if (attempts < 1) {
    throw new Error('Max Attempts Reached');
  }
  try {
    if (nextProvider >= mailProviderPool.length - 1) {
      nextProvider = 0;
    } else {
      nextProvider += 1;
    }
    logger.info(`sending with provider: ${nextProvider}, attempts: ${attempts}`);
    await mailProviderPool[nextProvider].sendMail({
      from, to, cc, bcc, subject, text,
    });
  } catch (e) {
    // try with a different mail provider connection
    await sendWithProvider({
      from, to, cc, bcc, subject, text,
    }, attempts - 1);
  }
};

const sendMail = async ({
  from, to, cc, bcc, subject, text,
}) => {
  logger.info('sending email');
  return sendWithProvider({
    from, to, cc, bcc, subject, text,
  }, mailMaxRetry);
};

module.exports = {
  sendMail,
};
