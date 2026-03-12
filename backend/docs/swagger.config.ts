const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EventHub API",
      version: "1.0.0",
      description: "Documentation de l’API EventHub",
    },
    servers: [
      {
        url: "http://localhost:8000/api",
        description: "Serveur de développement",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  // ⚠️ Mets ici les chemins réels de TON projet
  apis: [
    "./src/api/routes/**/*.ts",
    "./src/api/controllers/**/*.ts",
    "./src/api/dto/**/*.ts",
    "./src/api/middlewares/**/*.ts",
    "./src/api/utility/**/*.ts",
    "./src/api/app.ts",
  ],
};

export default swaggerOptions;
