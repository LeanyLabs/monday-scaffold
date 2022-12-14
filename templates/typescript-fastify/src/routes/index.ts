import { FastifyInstance, FastifyRequest } from 'fastify';
import { SERVICE_NAME } from '~/config';
import { mondayRoutes } from '~/routes/monday';


export async function routes(fastify: FastifyInstance) {
  fastify.get('/', getHealth);
  fastify.get('/health', getHealth);
  fastify.register(mondayRoutes, { prefix: '/monday' });
}


function getHealth(req: FastifyRequest, res) {
  res.code(200).send({
    ok: true,
    message: 'Healthy',
    serviceName: SERVICE_NAME
  });
}

