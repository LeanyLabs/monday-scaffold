import jwt from 'jsonwebtoken';
import logger from '@leanylabs/logger';
import { MondayApi } from '../services/monday/api';

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
    const apiClient = new MondayApi(shortLivedToken, exp);
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
