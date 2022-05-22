const https = require('https');

const Logger = require('../helpers/logger');

const logger = new Logger('sendGrid Email Provider');

const { host, key, path } = require('../config').get('/sendGrid');
const MailProvider = require('./mailProvider');

class SendGridMailProvider extends MailProvider {
  async sendMail({
    from, to, cc, bcc, subject, text,
  }) {
    super.sendMail();
    logger.info('sending with SendGrid');

    // const headers = new Headers();
    // headers.append('Authorization', `Bearer ${key}`);
    // headers.append('Content-Type', 'application/json');
    //
    // const raw = JSON.stringify({
    //   personalizations: [
    //     {
    //       to: [
    //         {
    //           email: 'john.doe@example.com',
    //           name: 'John Doe',
    //         },
    //       ],
    //       subject,
    //     },
    //   ],
    //   content: [
    //     {
    //       type: 'text/plain',
    //       value: text,
    //     },
    //   ],
    //   from: {
    //     email: from,
    //   },
    // });
    //
    // const requestOptions = {
    //   method: 'POST',
    //   headers,
    //   body: raw,
    //   redirect: 'follow',
    // };
    //
    // const response = await fetch(host, requestOptions).then((resp) => resp.text());
    //

    const data = JSON.stringify({
      personalizations: [
        {
          to: [
            {
              email: to,
            },
          ],
          subject,
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

      req.on('error', (error) => {
        reject(error);
      });

      req.write(data);
      req.end();
    });

    logger.info('response from sendgrid API', response);
  }
}

module.exports = SendGridMailProvider;
