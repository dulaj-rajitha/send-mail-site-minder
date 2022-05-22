const https = require('https');

const Logger = require('../helpers/logger');

const logger = new Logger('sendGrid Email Provider');

const { host, key, path } = require('../config').get('/sendGrid');
const MailProvider = require('./mailProvider');

/**
 * This class will implement the email sending functionality using SendGrid API
 */
class SendGridMailProvider extends MailProvider {
  async sendMail({
    from, to, cc, bcc, subject, text,
  }) {
    super.sendMail();
    logger.info('sending with SendGrid');

    const ccMails = cc && cc.length ? cc.map((email) => ({ email })) : undefined;
    const bccMails = bcc && bcc.length ? bcc.map((email) => ({ email })) : undefined;

    const data = JSON.stringify({
      personalizations: [
        {
          to: [
            {
              email: to,
            },
          ],
          cc: ccMails,
          bcc: bccMails,
        },
      ],
      content: [
        {
          type: 'text/plain',
          value: text,
        },
      ],
      from: {
        email: from,
      },
      subject,
    });

    const response = await new Promise((resolve, reject) => {
      const options = {
        hostname: host,
        port: 443,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
          Authorization: `Bearer ${key}`,
        },
      };

      const req = https.request(options, (res) => {
        if (res.statusCode !== 202) {
          reject(res.statusMessage || 'Server Error');
        } else {
          const chunks = [];

          res.on('data', (chunk) => {
            chunks.push(chunk);
          });

          res.on('end', () => {
            logger.info('request completed', chunks);
            return resolve('Mail Send successfully');
          });
        }
      });

      req.on('error', (error) => reject(error));

      req.write(data);
      req.end();
    });

    logger.info('response from sendgrid API: ', response);
    return 'Mail Send Success with SendGrid API';
  }
}

module.exports = SendGridMailProvider;
