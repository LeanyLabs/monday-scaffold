import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../services/db-service';
import { UPDATE_TERM_IN_MINUTES } from '../config';
import { v4 as uuid } from 'uuid';
import { differenceInMinutesFromNow } from '../utils';

export class Subscription extends Model {
  public boardId: string;
  public webhookId: string;
  public webhookUrl: string;
  public integrationId: string;
  public isInitialSyncFinished: boolean;
  public accountId: number;
  public lastUpdate: Date;
  isToUpdate: () => boolean;
}

Subscription.init(
  {
    webhookId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuid(),
    },
    accountId: {
      type: DataTypes.BIGINT,
    },
    boardId: {
      type: DataTypes.STRING,
    },

    webhookUrl: {
      type: DataTypes.STRING(2100),
    },
    integrationId: {
      type: DataTypes.STRING,
    },
    lastUpdate: {
      type: DataTypes.DATE,
    },
    isInitialSyncFinished: {
      type: DataTypes.BOOLEAN,
    },
    isToUpdate: {
      type: DataTypes.VIRTUAL,
      get() {
        return differenceInMinutesFromNow(this.lastUpdate) > UPDATE_TERM_IN_MINUTES || !this.isInitialSyncFinished;
      },
    },
  },
  { sequelize }
);
