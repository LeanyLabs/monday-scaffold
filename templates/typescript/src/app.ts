import express from 'express';
import { logger } from '@leanylabs/logger';
import { PORT, SERVICE_NAME } from './config';
import routes from './routes';

async function start() {
  try {
    const app = express();

    app.use(routes);

    app.listen(PORT, function () {
      logger.info(`${SERVICE_NAME} server started at http://localhost:${PORT}`);
    });
  } catch (error) {}
}

start();
