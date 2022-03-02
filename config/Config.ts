import * as dotenv from 'dotenv';
dotenv.config();

const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME,
  DB_SERVER,
  API_PREFIX,
  SECRET,
  REFRESH_STRING,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_DB,
  EMAIL_LOGIN,
  EMAIL_PASSWORD,
  MAILER_HOST,
  MAILER_PORT,
  MAILER_FROM,
  MAILER_TEMPLATE_PATH,
  STATIC_ROOT_PATH,
  STATIC_SERVE_ROOT,
  MULTER_DEST,
  SALT_OR_ROUNDS
} = process.env;

const DB = {
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  name: DB_NAME,
  dbServer: DB_SERVER
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

const EMAIL = {
  login: EMAIL_LOGIN,
  password: EMAIL_PASSWORD
}

const MAILER = {
  host: MAILER_HOST,
  port: MAILER_PORT,
  from: MAILER_FROM,
  templatePath: MAILER_TEMPLATE_PATH
}

const STATIC = {
  rootPath: STATIC_ROOT_PATH,
  serveRoot: STATIC_SERVE_ROOT
}

const MULTER = {
  dest: MULTER_DEST
}

const BCRYPT = {
  saltOrRounds: SALT_OR_ROUNDS
}

const config = {
  DB,
  api_prefix,
  AUTH,
  REDIS,
  EMAIL,
  MAILER,
  STATIC,
  MULTER,
  BCRYPT
};

export default config;
