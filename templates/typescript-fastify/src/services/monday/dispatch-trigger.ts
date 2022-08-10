import { logger } from '@leanylabs/logger';
import axios from 'axios';
import { MONDAY_SIGNING_SECRET } from '~/config';


export async function dispatchTrigger(
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
          outputFields
        }
      },
      headers: {
        Authorization: MONDAY_SIGNING_SECRET
      }
    });
  } catch (error) {
    logger.warn('failed to trigger dispatch');
    return error;
  }
}
