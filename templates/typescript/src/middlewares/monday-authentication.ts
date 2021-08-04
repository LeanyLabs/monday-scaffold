import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '@leanylabs/logger';

export default async function (req: any, res: Response, next: NextFunction) {
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
    res.status(401).json({ error: 'not authenticated' });
  }
}
