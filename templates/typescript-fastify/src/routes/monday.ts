import { FastifyInstance } from 'fastify';
import { executeAction } from '~/controllers/monday-actions-controller';
import { subscribe, unsubscribe } from '~/controllers/monday-triggers-controller';
import { authenticationMiddleware } from '~/middlewares/authentication';
import { auth, getAccessToken } from '~/services/monday/auth/auth-controller';

export async function mondayRoutes(fastify: FastifyInstance) {
  fastify.register(authorization, { prefix: '/auth' });
  fastify.register(actions, { prefix: '/actions' });
  fastify.register(triggers, { prefix: '/triggers' });
}

async function authorization(fastify: FastifyInstance) {
  fastify.get('/callback', getAccessToken);
  fastify.get('/monday', { preHandler: authenticationMiddleware }, auth);
}

async function actions(fastify: FastifyInstance) {
  fastify.post('/execute', executeAction);
}

async function triggers(fastify: FastifyInstance) {
  fastify.post('/subscribe', subscribe);
  fastify.post('/unsubscribe', unsubscribe);
}
