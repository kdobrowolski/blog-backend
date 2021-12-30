import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import config from '../config/Config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    KnexModule.forRoot({
      config: {
        client: 'mysql',
        useNullAsDefault: true,
        connection: {
          host: config.DB.host,
          user: config.DB.user,
          password: config.DB.password,
          database: config.DB.name,
        },
      },
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
