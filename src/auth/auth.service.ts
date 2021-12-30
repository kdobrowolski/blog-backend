import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { sha256 } from 'js-sha256';
import config from '../../config/Config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const asyncRedis = require('async-redis');

@Injectable()
export class AuthService {
  refreshTokenRedis;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    this.refreshTokenRedis = asyncRedis.createClient({
      host: config.REDIS.host,
      port: config.REDIS.port,
      db: config.REDIS.db,
    });
  }

  async validateUser(username, password): Promise<any> {
    const data = await this.userService.findOne(username);
    const isMatch = await bcrypt.compare(password, data.user.password);

    if (isMatch) {
      const { password, ...result } = data.user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
    };

    const refreshTokenToSha256 = sha256(
      payload.sub + config.AUTH.refresh_string + Date.now(),
    );

    await this.refreshTokenRedis.set(
      refreshTokenToSha256,
      payload.sub.toString(),
      'EX',
      60,
    );

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshTokenToSha256,
    };
  }
}
