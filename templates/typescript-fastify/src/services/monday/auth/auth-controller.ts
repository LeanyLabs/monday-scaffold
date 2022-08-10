import { logger } from '@leanylabs/logger';
import jwt from 'jsonwebtoken';
import { MONDAY_CLIENT_ID, MONDAY_CLIENT_SECRET, MONDAY_SIGNING_SECRET } from '~/config';
import { MondayApi } from '~/services/monday/api';
import { accessTokenManager } from '~/services/monday/auth/access-token-manager';

export function getAuthUrl(state: string) {
  return `https://auth.monday.com/oauth2/authorize?client_id=${MONDAY_CLIENT_ID}&state=${state}`;
}

export async function auth(req, res) {
  const { token } = req.query;
  const { backToUrl, accountId, userId } = req.session;
  const tokenExists = accessTokenManager.getAccessToken(accountId, userId);
  return tokenExists
    ? res.redirect(backToUrl)
    : res.redirect(getAuthUrl(token));
}

export async function getAccessToken(req: any, res: any) {
  // eslint-disable-next-line camelcase
  const { code, state, error, error_description } = req.query;
  const { accountId, userId, backToUrl } = jwt.verify(state, MONDAY_SIGNING_SECRET);

  const tokenExists = accessTokenManager.getAccessToken(accountId, userId);
  if (tokenExists) return res.redirect(backToUrl);
  if (!code) {
    // eslint-disable-next-line camelcase
    logger.warn('Failed to authorize', { error, error_description });
    return res.redirect(backToUrl);
  }

  const apiClient = new MondayApi('', Infinity);
  try {
    const token = await apiClient.oauthToken(
      code,
      MONDAY_CLIENT_ID,
      MONDAY_CLIENT_SECRET
    );
    await accessTokenManager.saveToken(accountId, userId, token.access_token);
  } catch (error) {
    logger.warn('Failed to get access token', { error });
  }
  return res.redirect(backToUrl);
}
