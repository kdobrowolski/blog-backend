import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import config from '../config/Config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(config.api_prefix);
  app.use(cookieParser());
  await app.listen(8000);
}
bootstrap();
