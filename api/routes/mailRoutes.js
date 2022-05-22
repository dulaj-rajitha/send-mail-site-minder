const express = require('express');

const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated');
const isValidPayload = require('../middlewares/isValidPayload');

const mailController = require('../controllers/mailController');

const { sendMailSchema } = require('../config/validations/sendMail');

/**
 *  @swagger
 *  /email/:
 *  post:
 *    summary: Send Email
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            properties:
 *              from:
 *                type: string
 *                example: dulajrajitha@gmail.com
 *                required: true
 *              to:
 *                type: string
 *                example: dulajrajitha@gmail.com
 *                required: true
 *              cc:
 *                type: array
 *                required: false
 *                items:
 *                  type: string
 *                  example: dulajrajitha2@gmail.com
 *              bcc:
 *                type: array
 *                required: false
 *                items:
 *                  type: string
 *                  example: dulajrajitha3@gmail.com
 *              subject:
 *                type: string
 *                example: Testing From Email sender
 *              text:
 *                type: string
 *                example: Hi, Sending From Send Email Service
 *    responses:
 *      "200":
 *        description: Email Sent Successfully
 *      "400":
 *        description: Bad Request
 *      "500":
 *        description: Internal server error.
 */
router.post('/', isAuthenticated, isValidPayload(sendMailSchema), mailController.sendMail);

module.exports = router;
