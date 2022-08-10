import { logger } from '@leanylabs/logger';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export function handleErrors(
  err: FastifyError,
  req: FastifyRequest,
  res: FastifyReply
) {
  logger.error(`Route failed: ${req.url}`, err);
  res.status(500).send('Internal Server Error');
}
