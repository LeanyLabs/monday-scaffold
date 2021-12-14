import jwt from 'jsonwebtoken';
import logger from '@leanylabs/logger';
import { MondayApiClient } from '../services/monday-api.client.service';

export async function authenticationMiddleware(req, res, next) {
  try {
    let { authorization } = req.headers;
    if (!authorization && req.query) {
      authorization = req.query.token;
    }
    const { accountId, userId, backToUrl, shortLivedToken, exp } = jwt.verify(
      authorization,
      process.env.MONDAY_SIGNING_SECRET
    );
    const apiClient = new MondayApiClient(shortLivedToken, exp);
    req.session = {
      accountId,
      userId,
      backToUrl,
      shortLivedToken,
      apiClient,
    };
    next();
  } catch (err) {
    logger.error('Auth middleware error', err);
    res.status(401).json({ error: 'not authenticated' });
  }
}
