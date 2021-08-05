import express from 'express';
import { logger } from '@leanylabs/logger';
import { PORT, SERVICE_NAME } from './config';
import routes from './routes';
import { tracer } from './middlewares/tracer';
import { handleErrors } from './middlewares/error-handler';

async function start() {
  try {
    const app = express();

    app
      .use(tracer)
      .use(express.json({ limit: '10mb' }))
      .use(routes)
      .use(handleErrors);

    app.listen(PORT, function () {
      logger.info(`${SERVICE_NAME} server started at http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('App did not started!', { message: error.message, error });
  }
}

start();
