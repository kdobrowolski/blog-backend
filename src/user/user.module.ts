import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => RedisModule),
  ],
  controllers: [
    UserController
  ],
  providers: [
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
