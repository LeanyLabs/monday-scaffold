import { Response, NextFunction, request } from 'express';
import { MondayApiClient } from '../services/monday-api.client.service';

export default function (req: any, res: Response, next: NextFunction) {
  //inject monday api client
  const { shortLivedToken } = req.session;
  const mondayApiClient = new MondayApiClient(shortLivedToken);
  req.session.apiClient = mondayApiClient;

  //inject all fields
  req.mondayFields = {};

  const payload = req.body.payload;
  if (!payload?.inputFields) req.mondayFields = { ...payload.inputFields };
  if (!payload?.webhookUrl) req.mondayFields.webhookUrl = payload.webhookUrl;
  if (!payload?.webhookId) req.mondayFields.webhookId = payload.webhookId;
  next();
}
