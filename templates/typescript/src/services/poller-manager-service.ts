import { logger } from '@leanylabs/logger';
import { Subscription } from '../models/subscription-model';
import { delay } from '../utils/delay';
import { NEW_ACCOUNT_CHECK_INTERVAL_IN_MIN } from '../config';
import Poller from './poller-service';

class PollerManager {
  private isPollingStarted = false;
  private instantiatedClasses = new Map();
  private anticipationTime: number;

  constructor(anticipationTime) {
    this.anticipationTime = anticipationTime * 30000;
  }

  createPoller(accountId) {
    if (this.instantiatedClasses.has(accountId)) {
      return this.instantiatedClasses.get(accountId);
    }
    const poller = new Poller(accountId);
    this.instantiatedClasses.set(accountId, poller);
    return poller;
  }

  start() {
    if (this.isPollingStarted) return;
    this.isPollingStarted = true;
    this.poll();
  }

  async poll() {
    while (this.isPollingStarted) {
      const accounts: [] = await Subscription.aggregate('accountId', 'DISTINCT', { plain: false });

      accounts.map(async ({ DISTINCT: accountId }) => {
        const poller = this.createPoller(accountId);
        poller.start();
      });
      await delay(this.anticipationTime);
    }
  }
}

const pollerManager = new PollerManager(NEW_ACCOUNT_CHECK_INTERVAL_IN_MIN);
export { PollerManager };
export default pollerManager;
