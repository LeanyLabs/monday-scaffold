import { logger } from '@leanylabs/logger';
import { Subscription } from '../models/subscription-model';
import { delay } from '../utils/delay';
import { dispatchTrigger } from './trigger-service';

class Poller {
  private accountId: number;
  private isPollingStarted = false;
  private anticipationTime = 1000;
  constructor(accauntId) {
    this.accountId = accauntId;
  }

  start() {
    if (this.isPollingStarted) return;
    this.isPollingStarted = true;
    this.poll();
  }

  setAnticipationTime(seconds: number) {
    this.anticipationTime = seconds * 1000;
  }

  async poll() {
    while (this.isPollingStarted) {
      const subscriptionToupdate = await Subscription.findOne({
        where: { accountId: this.accountId },
        order: [['lastUpdate', 'ASC']],
      });

      if (subscriptionToupdate.isToUpdate) {
        await this.dispatchUpdate(subscriptionToupdate);
      }
      await delay(this.anticipationTime);
    }
  }

  async dispatchUpdate(subbscription) {
    const {
      webhookUrl,
      webhookId,
      //any needed fields from a subscription instance
    } = subbscription;

    const triggerOutputData = {
      //any needed data
    };

    try {
      await dispatchTrigger(webhookUrl, triggerOutputData);
      await Subscription.update({ lastUpdate: new Date(), isInitialSyncFinished: true }, { where: { webhookId } });
    } catch (error) {
      logger.info('failed to dispatch upfate poller is suspended');
      this.setAnticipationTime(60);
    }
  }
}

export default Poller;
