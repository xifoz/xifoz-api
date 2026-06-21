import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { env } from './config/env';

import { requestIdMiddleware } from './middleware/request-id/request-id';
import { globalRateLimiter } from './middleware/rateLimiter';

import {
  errorHandler,
  notFoundHandler,
} from './middleware/errorHandler';

import { apiRouter } from './routes';

const app = express();

app.set('trust proxy', 1);

app.use(requestIdMiddleware);

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: false }));

app.use(globalRateLimiter);

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
