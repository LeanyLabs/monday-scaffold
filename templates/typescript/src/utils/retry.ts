import { logger } from '@leanylabs/logger';
import { delay } from './delay';

export async function callWithRetry(callback, maxTries, queryDelay) {
  let lastError: Error;
  let tries = 0;
  while (tries < maxTries) {
    try {
      await delay(queryDelay);
      const result = await callback();
      return result;
    } catch (err) {
      tries++;
      lastError = err;
      logger.warn('retry attempt failed...', err);
    }
  }
  logger.warn(`max tries limit exceeded`);
  throw lastError;
}
