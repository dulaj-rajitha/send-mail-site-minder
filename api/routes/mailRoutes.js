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
 *              to:
 *                type: string
 *              cc:
 *                type: string
 *              bcc:
 *                type: string
 *              text:
 *                type: string
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
