require('dotenv').config();
import env from 'env-var';

export const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;
export const NEW_ACCOUNT_CHECK_INTERVAL_IN_MIN = env.get('NEW_ACCOUNT_CHECK_INTERVAL_IN_MIN').default(0.5).asFloat();
export const SERVICE_NAME = env.get('SERVICE_NAME').default('monday-assembled-app').asString();
export const NODE_ENV = env.get('NODE_ENV').default('local').asString();
export const PORT = env.get('PORT').default('8080').asPortNumber();
export const MONDAY_QUERY_INTERVAL_IN_MS = env.get('MONDAY_QUERY_INTERVAL_IN_MS').default(5000).asInt();
export const MAX_MONDAY_API_RETRIES = env.get('MAX_MONDAY_API_RETRIES').default(3).asInt();
export const UPDATE_TERM_IN_MINUTES = env.get('UPDATE_TERM_IN_MINUTES').default(2).asInt();
export const LOGGING_LEVEL = env
  .get('LOGGING_LEVEL')
  .default('info')
  .asEnum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']);

export const isProd = NODE_ENV.includes('prod');
export const isDev = !isProd;
