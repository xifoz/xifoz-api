import 'dotenv/config';

import { app } from './app';

import { env } from './config/env';
import {
  connectDatabase,
  disconnectDatabase,
} from './config/database';

import { logger } from './utils/logger';

import { bootstrapService } from './services/admin/bootstrap.service';

async function start() {
  await connectDatabase();

  await bootstrapService.run();

  const server = app.listen(
    env.PORT,
    '0.0.0.0',
    () => {
      logger.info(
        `XIFOZ API running on ${env.PORT} (${env.NODE_ENV})`,
      );
    },
  );

  async function shutdown(signal: string) {
    logger.info(`${signal} received`);

    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  }

  process.on(
    'SIGINT',
    () => void shutdown('SIGINT'),
  );

  process.on(
    'SIGTERM',
    () => void shutdown('SIGTERM'),
  );
}

void start();
