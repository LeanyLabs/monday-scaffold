require('pg').defaults.parseInt8 = true;
import { logger } from '@leanylabs/logger';
import { Sequelize } from 'sequelize';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, SQL_TRACE } from '~/config';


export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  port: DB_PORT || 5432,
  logging: SQL_TRACE
});

export async function initSequelize() {
  try {
    logger.info('Trying to connect to the database');
    await sequelize.sync();
    logger.info('DB connection has been established successfully');
  } catch (err) {
    logger.error(`Failed to establish DB connection`, { error: err });
    throw err;
  }
}
