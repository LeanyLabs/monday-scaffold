import { Request, Response, NextFunction } from 'express';
import { logger } from '@leanylabs/logger';

export const handleErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Route failed: ${req.url}`, err);
  res.status(500).send('Internal Server Error');
};
