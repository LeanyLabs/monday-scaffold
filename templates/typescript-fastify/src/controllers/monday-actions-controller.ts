export async function executeAction(req, res) {
  const { apiClient } = req.session;

  const { inputFields } = req.body.payload;
  const { boardId, itemId, sourceColumnId, targetColumnId, transformationType } = inputFields;


  return res.status(200).send({});
}
