const emailService = require('../services/emailService');

const sendMail = async (req, res, next) => {
  try {
    const response = await emailService.sendMail(req.body);
    res.status(200).json({ ok: true, data: response, error: null });
  } catch (e) {
    next(e);
  }
};

module.exports = { sendMail };
