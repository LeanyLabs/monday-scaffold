import axios from 'axios';
import { logger } from '@leanylabs/logger';

const { MONDAY_SIGNING_SECRET } = process.env;

export async function dispatchTrigger(
  url: string,
  {
    //passed data for trigger output fields
  }
): Promise<any> {
  logger.silly('dispatching trigger');
  const response = await axios({
    method: 'post',
    url,
    data: {
      trigger: {
        outputFields: {
          // all neede uutput fields
        },
      },
    },
    headers: {
      Authorization: MONDAY_SIGNING_SECRET,
    },
  });

  return response;
}
