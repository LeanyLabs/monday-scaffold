import express from 'express';
import { logger } from '@leanylabs/logger';
import { PORT, SERVICE_NAME } from './config';
import routes from './routes';
import { handleErrors } from './middlewares/error-handler';
import { initSequelize } from './services/db-service';
import { accessTokenManager } from './services/monday/auth/access-token-manager';

async function start() {
  try {
    const app = express();

    await initSequelize();
    await accessTokenManager.init();

    app
      .use(express.json({ limit: '10mb' }))
      .use(routes)
      .use(handleErrors);
    app.listen(PORT, function () {
      logger.info(`${SERVICE_NAME} server started at http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('The app has been crashed', { error });
  }
}

start();
