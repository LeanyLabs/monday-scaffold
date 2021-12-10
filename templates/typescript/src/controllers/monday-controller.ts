import { TRANSFORMATION_TYPES } from '../constants';
import { MondayApiClient } from '../services/monday-api.client.service';
import { transformText } from '../services/transformation-service';
import { logger } from '@leanylabs/logger';

export async function executeAction(req, res) {
  const { shortLivedToken } = req.session;
  const apiClient = new MondayApiClient(shortLivedToken);

  try {
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
