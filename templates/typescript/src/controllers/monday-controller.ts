import { TRANSFORMATION_TYPES } from '../constants';
import { MondayApiClient } from '../services/monday-api.client.service';
import { transformText } from '../services/transformation-service';
import { logger } from '@leanylabs/logger';

export async function executeAction(req: any, res: any) {
  const { mondayApiClient } = req.session;
  const { boardId, itemId, sourceColumnId, targetColumnId, transformationType } = req.mondayFields;

  const text = await mondayApiClient.getColumnValue(itemId, sourceColumnId);
  if (!text) {
    return res.status(200).send({});
  }
  const transformedText = transformText(text, transformationType ? transformationType.value : 'TO_UPPER_CASE');

  await mondayApiClient.changeColumnValue(boardId, itemId, targetColumnId, transformedText);

  return res.status(200).send({});
}

export function getRemoteListOptions(req: any, res: any) {
  return res.status(200).send(TRANSFORMATION_TYPES);
}
