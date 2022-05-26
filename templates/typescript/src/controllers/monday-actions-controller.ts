import { transformText } from '../services/monday/transformation-service';

export async function executeAction(req, res) {
  const { apiClient } = req.session;

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
}
