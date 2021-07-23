require('dotenv').config();
import env from 'env-var';

export const SERVICE_NAME = env.get('SERVICE_NAME').default('monday-assembled-app').asString();
export const NODE_ENV = env.get('NODE_ENV').default('local').asString();
export const PORT = env.get('PORT').default('8080').asPortNumber();
export const LOGGING_LEVEL = env
  .get('LOGGING_LEVEL')
  .default('info')
  .asEnum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']);

export const isProd = NODE_ENV.includes('prod');
export const isDev = !isProd;
