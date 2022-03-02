import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MulterModule } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { ReactionModule } from './reaction/reaction.module';
import { CommentModule } from './comment/comment.module';
import config from '../config/Config';
import { join } from 'path';
import { RedisModule } from './redis/redis.module';
import { FileService } from './file/file.service';
import { FileModule } from './file/file.module';
import { GalleryModule } from './gallery/gallery.module';
import { AuthorModule } from './author/author.module';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    KnexModule.forRoot({
      config: {
        client: config.DB.dbServer,
        useNullAsDefault: true,
        connection: {
          host: config.DB.host,
          user: config.DB.user,
          password: config.DB.password,
          database: config.DB.name,
        },
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', config.STATIC.rootPath),
      serveRoot: config.STATIC.serveRoot
    }),
    MulterModule.register({
      dest: config.MULTER.dest,
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: config.MAILER.host,
             port: config.MAILER.port,
             ignoreTLS: true,
             secure: true,
             auth: {
                 user: config.EMAIL.login,
                 pass: config.EMAIL.password
             },
        },
        defaults: {
          from: `${config.MAILER.from}`,
        },
        template: {
          dir: __dirname + config.MAILER.templatePath,
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    UserModule,
    AuthModule,
    PostModule,
    ReactionModule,
    CommentModule,
    RedisModule,
    FileModule,
    GalleryModule,
    AuthorModule,
    CaslModule,
  ],
  controllers: [AppController],
  providers: [AppService, FileService],
})
export class AppModule {}
