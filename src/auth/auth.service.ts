import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { sha256 } from 'js-sha256';
import config from '../../config/Config';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private redisService: RedisService
  ) {}

  // VALIDATE USER

  async validateUser(username, password): Promise<any> {
    const data = await this.userService.findOneByUsername(username);
    const isMatch = await bcrypt.compare(password, data.user.password);

    if (isMatch) {
      const { password, ...result } = data.user;
      return result;
    }
    return null;
  }

  // LOGIN

  async generateTokenPairs(user: any): Promise<Record<string,any>> {

    const payload = {
      username: user.name,
      sub: user.id,
    };

    const refreshTokenToSha256 = sha256(
      payload.sub + config.AUTH.refresh_string + Date.now(),
    );

    await this.redisService.set(refreshTokenToSha256, payload.sub.toString());

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '5m' }),
      refreshToken: refreshTokenToSha256,
    };
  }
}
