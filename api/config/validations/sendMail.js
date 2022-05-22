const Joi = require('joi');

const sendMailSchema = Joi.object({
  body: Joi.object({
    from: Joi.string().required(),
    to: Joi.string().required(),
    cc: Joi.string().required(),
    bcc: Joi.string().required(),
    text: Joi.string().required(),
  }).required(),
}).unknown(true);

module.exports = { sendMailSchema };
