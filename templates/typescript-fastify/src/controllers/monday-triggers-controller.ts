import { Subscription } from '~/models/Subscription';

export async function subscribe(req, res) {
  const { accountId, userId } = req.session;

  const { webhookUrl, inputFields } = req.body.payload;
  const boardId = Number(inputFields.boardId);

  const subscription = await Subscription.create({
    accountId,
    userId,
    boardId,
    webhookUrl
  });

  return res.send({
    webhookId: subscription.id
  });
}

export async function unsubscribe(req, res) {
  const webhookId = req.body.payload.webhookId;
  await Subscription.destroy({ where: { id: webhookId } });
  return res.send({});
}
