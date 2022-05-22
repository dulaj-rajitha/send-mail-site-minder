const Logger = require('../helpers/logger');

const logger = new Logger('MailGun Email Provider');

const { host, key, path } = require('../config').get('/mailGun');

const MailProvider = require('./mailProvider');
const https = require('https');

class MailGunMailProvider extends MailProvider {
  async sendMail({
    from, to, cc, bcc, subject, text,
  }) {
    super.sendMail();
    logger.info('sending with MailGun');
    const data = `------WebKitFormBoundary7MA4YWxkTrZu0gW\r
Content-Disposition: form-data; name="from"\r
\r
${from}\r
------WebKitFormBoundary7MA4YWxkTrZu0gW\r
Content-Disposition: form-data; name="to"\r
\r
${to}\r
------WebKitFormBoundary7MA4YWxkTrZu0gW\r
Content-Disposition: form-data; name="subject"\r
\r
${subject}\r
------WebKitFormBoundary7MA4YWxkTrZu0gW\r
Content-Disposition: form-data; name="text"\r
\r
${text}\r
------WebKitFormBoundary7MA4YWxkTrZu0gW--`;

    const response = await new Promise((resolve, reject) => {
      const options = {
        hostname: host,
        port: 443,
        path,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${key}`,
        },
      };

      const req = https.request(options, (res) => {
        if (res.statusCode !== 200) {
          return reject(res.statusMessage || 'Server Error');
        }

        const chunks = [];
        res.on('data', (d) => chunks.push(d));
        res.on('end', () => {
          let resBody = Buffer.concat(chunks);
          if (res.headers['content-type'] === 'application/json') {
            resBody = JSON.parse(resBody);
          }
          resolve(resBody);
        });
      });

      req.setHeader('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');

      req.on('error', (error) => {
        reject(error);
      });

      req.write(data);
      req.end();
    });

    logger.info('response from sendgrid API', response);
  }
}

module.exports = MailGunMailProvider;
