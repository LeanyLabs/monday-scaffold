import querystring from 'querystring';
import jwt from 'jsonwebtoken';
import { logger } from '@leanylabs/logger';
import {
  MONDAY_CLIENT_ID,
  MONDAY_CLIENT_SECRET,
  MONDAY_SIGNING_SECRET,
} from '../../../config';
import { Response } from 'express';
import { MondayApi } from '../api';
import { accessTokenManager } from './access-token-manager';

export const getAuthUrl = (state: string) => {
  return `https://auth.monday.com/oauth2/authorize?${querystring.stringify({
    client_id: MONDAY_CLIENT_ID,
    state,
  })}`;
};

export const auth = async (req, res) => {
  const { token } = req.query;
  const { backToUrl, accountId, userId } = req.session;

  const tokenExists = accessTokenManager.getAccessToken(accountId, userId);
  return tokenExists
    ? res.redirect(backToUrl)
    : res.redirect(getAuthUrl(token));
};

export const getAccessToken = async (req: any, res: Response) => {
  // eslint-disable-next-line camelcase
  const { code, state, error, error_description } = req.query;
  const { accountId, userId, backToUrl } = jwt.verify(
    state,
    MONDAY_SIGNING_SECRET
  );

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
};
