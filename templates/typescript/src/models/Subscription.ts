import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../services/db-service';
import { v4 as uuid } from 'uuid';

export class Subscriptions extends Model {
  id: string;
  accountId: number;
  boardId: number;
  webhookUrl: string;
}

Subscriptions.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
    },
    accountId: {
      type: DataTypes.BIGINT,
    },
    userId: {
      type: DataTypes.BIGINT,
    },
    boardId: {
      type: DataTypes.BIGINT,
    },
    webhookUrl: {
      type: DataTypes.STRING,
    },
  },
  { sequelize }
);
