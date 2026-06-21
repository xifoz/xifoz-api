import 'dotenv/config';

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { env } from './config/env';

import { connectDatabase, disconnectDatabase } from './config/database';

import { requestIdMiddleware } from './middleware/request-id/request-id';
import { globalRateLimiter } from './middleware/rateLimiter';

import {
  errorHandler,
  notFoundHandler,
} from './middleware/errorHandler';

import contactRoutes from './routes/contact.routes';
import adminAuthRoutes from './routes/admin/auth.routes';
import dashboardRoutes from './routes/admin/dashboard.routes';

import { logger } from './utils/logger';

import { bootstrapService } from './services/admin/bootstrap.service';

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

app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  await connectDatabase();

  await bootstrapService.run();

  const server = app.listen(env.PORT, '0.0.0.0', () => {
    logger.info(
      `XIFOZ API running on ${env.PORT} (${env.NODE_ENV})`,
    );
  });

  async function shutdown(signal: string) {
    logger.info(`${signal} received`);

    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  }

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

void start();
