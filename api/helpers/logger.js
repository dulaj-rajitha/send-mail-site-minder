const log4js = require('log4js');

class Logger {
  constructor(logger = 'Service', level = 'info') {
    this.logger = log4js.getLogger(logger);
    this.logger.level = level;
  }

  info(message, ...args) {
    this.logger.info(message, ...args);
  }

  error(message, ...args) {
    this.logger.error(message, ...args);
  }
}

module.exports = Logger;
