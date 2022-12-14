import logger from '@leanylabs/logger';
import jwt from 'jsonwebtoken';
import { MondayApi } from '~/services/monday/api';
import { MondayRequest } from '~/types';


export async function authenticationMiddleware(req: MondayRequest, res) {
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
    req.session = { accountId, userId, backToUrl, shortLivedToken, apiClient };
  } catch (err) {
    logger.error('Auth middleware error', err);
    res.code(401).send({ error: 'not authenticated' });
  }
}
