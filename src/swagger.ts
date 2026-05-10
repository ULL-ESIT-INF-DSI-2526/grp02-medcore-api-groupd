import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { Express } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MedCore API',
      version: '1.0.0',
      description:
        'API REST para gestionar el sistema de información de un hospital',
    },
    servers: [
      {
        url: 'https://localhost:3000',
        description: 'Servidor de desarrollo',
      },
      {
        url: 'https://grp02-medcore-api-groupd.onrender.com',
        description: 'Servidor de producción',
      },
    ],
  },
  apis: [
    './src/routers/*.ts',
    './src/models/**/*.ts',
    './src/controllers/**/*.ts',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger UI disponible en https://localhost:3000/api-docs');
};
