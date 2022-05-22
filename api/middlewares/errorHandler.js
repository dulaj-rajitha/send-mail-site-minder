const Logger = require('../helpers/logger');

const logger = new Logger('ErrorHandler');

/**
 * Shared Error handler that will define the response if any error occurred
 * @param error
 * @param _req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports = (error, _req, res, next) => {
  logger.error('Error', error);
  if (res.headersSent) {
    return next(error);
  }
  return res.status(error.errorCode || 500).json({ ok: false, data: null, error: error.message });
};
