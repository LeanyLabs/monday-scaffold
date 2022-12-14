import { logger } from '@leanylabs/logger';
import Fastify from 'fastify';
import { PORT, SERVICE_NAME } from '~/config';
import { handleErrors } from '~/middlewares/error-handler';
import { routes } from '~/routes';
import { initSequelize } from '~/services/db-service';
import { accessTokenManager } from '~/services/monday/auth/access-token-manager';


(async function start() {
  try {
    await initSequelize();
    await accessTokenManager.init();

    const fastify = Fastify({ bodyLimit: 10485760 });
    fastify.register(routes);
    fastify.setErrorHandler(handleErrors);

    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    logger.info(`${SERVICE_NAME} server started at port ${PORT}`);
  } catch (error) {
    logger.error('The app has crashed', { error });
  }
})();


