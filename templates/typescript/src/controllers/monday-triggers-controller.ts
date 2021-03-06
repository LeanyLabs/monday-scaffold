import { Subscriptions } from '../models/Subscription';

export async function subscribe(req, res) {
  const { accountId, userId } = req.session;

  const payload = req.body.payload;
  const webhookUrl = payload.webhookUrl;
  const boardId = Number(payload.inputFields.boardId);

  const subscription = await Subscriptions.create({
    accountId,
    userId,
    boardId,
    webhookUrl,
  });

  return res.send({
    webhookId: subscription.id,
  });
}

export async function unsubscribe(req, res) {
  const webhookId = req.body.payload.webhookId;
  await Subscriptions.destroy({ where: { id: webhookId } });
  return res.send({});
}
