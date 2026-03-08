const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
      {
        url: "https://jon-portal-server.onrender.com",
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/controller/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;