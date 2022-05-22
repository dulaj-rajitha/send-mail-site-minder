const Joi = require('joi');

const sendMailSchema = Joi.object({
  body: Joi.object({
    from: Joi.string().required(),
    to: Joi.string().required(),
    cc: Joi.array().items(Joi.string()).optional().default([]),
    bcc: Joi.array().items(Joi.string()).optional().default([]),
    subject: Joi.string().required(),
    text: Joi.string().required(),
  }).required(),
}).unknown(true);

module.exports = { sendMailSchema };
