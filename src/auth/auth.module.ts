import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { LocalAuthGuard } from './local-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import config from '../../config/Config';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => RedisModule),
    PassportModule,
    JwtModule.register({
      secret: config.AUTH.secret,
      signOptions: { expiresIn: '500s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalAuthGuard, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
