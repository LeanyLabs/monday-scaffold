import { TRANSFORMATION_TYPES } from '../constants';
import { MondayApiClient } from '../services/monday-api.client.service';
import { transformText } from '../services/transformation-service';
import { logger } from '@leanylabs/logger';

//TODO: split it into two files 'monday-actions-controller', 'monday-types-controller'
export async function executeAction(req, res) {
  const { shortLivedToken } = req.session; //TODO: take 'mondayAPI' from session
  const apiClient = new MondayApiClient(shortLivedToken);

  try { //TODO: remove try-catch we have middleware for that
    const { payload } = req.body;
    const { inputFields } = payload;
    const {
      boardId,
      itemId,
      sourceColumnId,
      targetColumnId,
      transformationType,
    } = inputFields;

    const text = await apiClient.getColumnValue(itemId, sourceColumnId);
    if (!text) {
      return res.status(200).send({});
    }
    const transformedText = transformText(
      text,
      transformationType ? transformationType.value : 'TO_UPPER_CASE'
    );

    await apiClient.changeColumnValue(
      boardId,
      itemId,
      targetColumnId,
      transformedText
    );

    return res.status(200).send({});
  } catch (err) {
    logger.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

export function getRemoteListOptions(req, res) {
  return res.status(200).send(TRANSFORMATION_TYPES);
}
