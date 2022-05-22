const https = require('https');

const Logger = require('../helpers/logger');

const logger = new Logger('MailGun Email Provider');

const {
  host, key, path, boundary,
} = require('../config').get('/mailGun');
const MailProvider = require('./mailProvider');

class MailGunMailProvider extends MailProvider {
  async sendMail({
    to, subject, text,
  }) {
    super.sendMail();
    logger.info('sending with MailGun');

    const response = await new Promise((resolve, reject) => {
      const options = {
        hostname: host,
        port: 443,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${key}`,
        },
      };

      const req = https.request(options, (res) => {
        if (res.statusCode !== 200) {
          reject(res.statusMessage || 'Server Error');
        } else {
          const chunks = [];
          res.on('data', (d) => chunks.push(d));

          res.on('end', () => {
            let resBody = Buffer.concat(chunks);
            if (res.headers['content-type'] === 'application/json; charset=utf-8') {
              resBody = JSON.parse(resBody);
            }
            resolve(resBody);
          });

          res.on('error', (error) => {
            reject(error);
          });
        }
      });

      req.setHeader('content-type', `multipart/form-data; boundary=${boundary}`);

      // fixme: from value is hardcoded and other values won't work
      // fixme: cc and bcc values has to be verified and oly verified values are supported,
      //  so it;s not included here
      const data = `--${boundary}\r
Content-Disposition: form-data; name="from"\r
\r
Dulaj Pathirana <mailgun@sandbox80a364a2a39248208141e50396386291.mailgun.org>\r
--${boundary}\r
Content-Disposition: form-data; name="to"\r
\r
${to}\r
--${boundary}\r
Content-Disposition: form-data; name="subject"\r
\r
${subject}\r
--${boundary}\r
Content-Disposition: form-data; name="text"\r
\r
${text}\r
--${boundary}--`;

      req.write(data);
      req.end();
    });

    logger.info('response from MailGun API', response);
    return 'Mail Send Success with MailGun API';
  }
}

module.exports = MailGunMailProvider;
