const express = require('express');

const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerUi = require('swagger-ui-express');
const { swaggerOption } = require('./config/swagger');

const specs = swaggerJsdoc(swaggerOption);

const mailRoutes = require('./routes/mailRoutes');

const errorHandler = require('./middlewares/errorHandler');

function AppServer() {
  this.server = express();

  this.server.use(bodyParser.json());

  this.server.get('/', (_req, res) => {
    res.json({ ok: true, data: 'Email Service' });
  });

  this.server.get('/health', (_req, res) => {
    res.json({ ok: true, data: 'Success' });
  });

  // swagger
  this.server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  this.server.use('/email', mailRoutes);
  this.server.use(errorHandler);
}

module.exports = AppServer;
