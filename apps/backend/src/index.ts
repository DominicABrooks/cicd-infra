import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import itemsRouter from './routes/items.js';
import healthRouter from './routes/health.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger API docs — visit /api-docs in your browser
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve the raw OpenAPI JSON spec
app.get('/api-docs.json', (_req, res) => {
  res.json(swaggerSpec);
});

// Routes
app.use('/api/health', healthRouter);
app.use('/api/items', itemsRouter);

// Legacy hello endpoint (kept for Pact contract compatibility)
app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from Backend' });
});

// Export for testing (Pact provider verification, etc.)
export { app };
export const server = app;

// Start server when run directly
import { fileURLToPath } from 'url';

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
    console.log(`Swagger docs at http://localhost:${port}/api-docs`);
  });
}
