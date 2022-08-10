import { Op } from 'sequelize';
import { AccessToken } from '~/models/AccessToken';
import { MondayApi } from '~/services/monday/api';

export async function getMondayApiClient(accountId: number, userId: number) {
  const token = await AccessToken.findOne({
    where: {
      [Op.and]: [
        { userId },
        { accountId }]
    }
  });

  return new MondayApi(token.accessToken);
}
