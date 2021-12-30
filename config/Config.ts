import * as dotenv from 'dotenv';
dotenv.config();

const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME,
  API_PREFIX,
  SECRET,
  REFRESH_STRING,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_DB,
} = process.env;

const DB = {
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  name: DB_NAME,
};

const api_prefix = API_PREFIX;

const AUTH = {
  secret: SECRET,
  refresh_string: REFRESH_STRING,
};

const REDIS = {
  host: REDIS_HOST,
  port: parseInt(REDIS_PORT) || 6379,
  db: REDIS_DB,
};

const config = {
  DB,
  api_prefix,
  AUTH,
  REDIS,
};

export default config;
