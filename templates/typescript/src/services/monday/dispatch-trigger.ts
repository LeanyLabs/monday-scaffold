import axios from 'axios';
import { logger } from '@leanylabs/logger';

const MONDAY_SIGNING_SECRET = process.env.MONDAY_SIGNING_SECRET;

export default async function dispatchTrigger(
  subscription: { webhookUrl: string },
  outputFields: any
): Promise<void> {
  try {
    const { webhookUrl } = subscription;
    await axios({
      method: 'post',
      url: webhookUrl,
      data: {
        trigger: {
          outputFields,
        },
      },
      headers: {
        Authorization: MONDAY_SIGNING_SECRET,
      },
    });
  } catch (error) {
    logger.warn('failed triger dispatch');
    return error;
  }
}
