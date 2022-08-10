import dotenv from 'dotenv';
import env from 'env-var';

dotenv.config();
export const SERVICE_NAME = env.get('SERVICE_NAME').default('monday-assembled-app').asString();
export const NODE_ENV = env.get('NODE_ENV').default('local').asString();
export const PORT = env.get('PORT').default('8080').asPortNumber();
export const MONDAY_QUERY_INTERVAL_IN_MS = env.get('MONDAY_QUERY_INTERVAL_IN_MS').default(5000).asInt();
export const MAX_MONDAY_API_RETRIES = env.get('MAX_MONDAY_API_RETRIES').default(3).asInt();
export const LOGGING_LEVEL = env
  .get('LOGGING_LEVEL')
  .default('info')
  .asEnum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']);

export const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;
export const { MONDAY_CLIENT_ID, MONDAY_CLIENT_SECRET, MONDAY_SIGNING_SECRET } = process.env;

export const DB_PORT = env.get('DB_PORT').default('5432').asInt();
export const SQL_TRACE = env.get('SQL_TRACE').default('false').asBool();

export const isProd = NODE_ENV.includes('prod');
export const isDev = !isProd;
