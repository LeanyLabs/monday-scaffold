import { FastifyReply } from 'fastify';
import { ActionBody, MondayRequest } from '~/types';


export async function executeAction(req: MondayRequest<ActionBody>, res: FastifyReply) {
  const { apiClient } = req.session;

  const { inputFields } = req.body.payload;
  const { boardId, itemId, sourceColumnId, targetColumnId, transformationType } = inputFields;


  return res.code(200).send({});
}
