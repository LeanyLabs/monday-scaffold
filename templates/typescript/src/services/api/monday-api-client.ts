import { logger } from '@leanylabs/logger';
import { secondsToMilliseconds } from 'date-fns';
import { MondayApiBase } from './monday-api-base';
import { delay } from '../../utils/delay';

export class MondayApi extends MondayApiBase {
  async complexity() {
    const query = `query {
      complexity {
        before
        reset_in_x_seconds
      }
    }`;
    return await this.api(query, {});
  }

  async checkEnoughComplexity(nededComplexity: number) {
    const { complexity } = await this.complexity();
    // eslint-disable-next-line camelcase
    const { before, reset_in_x_seconds } = complexity;
    if (before < nededComplexity) {
      // eslint-disable-next-line camelcase
      logger.info(`wait for complexity ${reset_in_x_seconds} second`);
      await delay(secondsToMilliseconds(reset_in_x_seconds));
    }
  }

  async sendNotification(
    userId: number,
    targetId: number,
    text: string,
    targetType = 'Project'
  ) {
    const query = `
      mutation
        create_notification($userId: Int!, $targetId: Int!, $text: String!, $targetType: NotificationTargetType!  ) {
          create_notification (user_id: $userId, target_id: $targetId, text: $text, target_type: $targetType) {
              text
            }
          }
    `;

    const variables = { userId, targetId, text, targetType };
    return await this.api(query, variables);
  }
}
