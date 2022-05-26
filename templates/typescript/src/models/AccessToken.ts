import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../services/db-service';

export class AccessToken extends Model {
  accountId: number;
  userId: number;
  accessToken: string;
}

AccessToken.init(
  {
    accountId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    accessToken: {
      type: DataTypes.STRING(2100),
    },
  },
  { sequelize }
);
