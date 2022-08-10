import { DataTypes, Model } from 'sequelize';
import { v4 as uuid } from 'uuid';
import { sequelize } from '~/services/db-service';

export class Subscription extends Model {
  id: string;
  accountId: number;
  boardId: number;
  webhookUrl: string;
}

Subscription.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid()
    },
    accountId: {
      type: DataTypes.BIGINT
    },
    userId: {
      type: DataTypes.BIGINT
    },
    boardId: {
      type: DataTypes.BIGINT
    },
    webhookUrl: {
      type: DataTypes.STRING
    }
  },
  { sequelize }
);
