import jwt from 'jsonwebtoken';
import logger from '@leanylabs/logger';

export async function authenticationMiddleware(req, res, next) {
  try {
    let { authorization } = req.headers;
    if (!authorization && req.query) {
      authorization = req.query.token;
    }
    const { accountId, userId, backToUrl, shortLivedToken } = jwt.verify(
      authorization,
      process.env.MONDAY_SIGNING_SECRET
    );
    req.session = { accountId, userId, backToUrl, shortLivedToken };
    next();
  } catch (err) {
    logger.error('Auth middleware error', err);
    res.status(500).json({ error: 'not authenticated' });
  }
}
