import { MondayApi } from '~/services/monday/api';
import { accessTokenManager } from '~/services/monday/auth/access-token-manager';


export function getMondayApiClient(accountId: number, userId: number): MondayApi {
  const accessToken = accessTokenManager.getAccessToken(accountId, userId);

  return new MondayApi(accessToken);
}
