const swaggerOption = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Email Sender',
      version: '1.0.0',
      description: 'Email Sender Service',
    },
    servers: [
      {
        url: 'http://localhost:8080',
      }, {
        url: 'https://email-sender-dulaj.herokuapp.com',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./api/routes/*.js'],
};

module.exports = { swaggerOption };
