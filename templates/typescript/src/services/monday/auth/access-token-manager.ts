import { logger } from '@leanylabs/logger';
import { AccessToken } from '../../../models/AccessToken';

class AccessTokenManager {
  private _tokens: Map<string, string> = new Map();

  async init() {
    await this.cacheTokensFromDb();
  }

  getAccessToken(accountId: number, userId: number) {
    return this._tokens.get(toKey(accountId, userId));
  }

  async saveToken(accountId: number, userId: number, accessToken: string) {
    this._tokens.set(toKey(accountId, userId), accessToken);
    await AccessToken.upsert({ accountId, userId, accessToken });
  }

  async removeToken(accountId: number, userId: number) {
    this._tokens.delete(toKey(accountId, userId));
    await AccessToken.destroy({
      where: {
        accountId,
        userId,
      },
    });
  }

  private async cacheTokensFromDb() {
    const tokens = (await AccessToken.findAll()) ?? [];

    for (const item of tokens) {
      const { accountId, userId, accessToken } = item;
      const key = toKey(accountId, userId);
      this._tokens.set(key, accessToken);
    }
  }
}

function toKey(accountId: number, userId: number) {
  return `${accountId}:${userId}`;
}

const accessTokenManager = new AccessTokenManager();
export { AccessTokenManager, accessTokenManager };
