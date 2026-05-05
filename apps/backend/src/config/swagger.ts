import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'CICD-Infra Backend API',
      version: '1.0.0',
      description: 'REST API for the CICD-Infra monorepo backend. Authenticated via Supabase Auth.',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Local development',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Supabase access token. Obtain via Supabase Auth (email/password, OAuth, etc.).',
        },
      },
    },
  },
  // Scan route files for @openapi JSDoc annotations
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
