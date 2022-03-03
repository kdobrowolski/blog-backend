import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../redis/redis.module';
import { RoleService } from 'src/role/role.service';

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
    RoleService
  ],
  exports: [UserService],
})
export class UserModule {}
