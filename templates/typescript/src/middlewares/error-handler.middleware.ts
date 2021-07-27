import express from 'express';
import { logger } from '@leanylabs/logger';

export const handleErrors = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(`Route failed: ${req.url}`, err);
  res.status(500).send('Internal Server Error');
};
