import { Injectable } from '@nestjs/common';
import config from '../../config/Config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const asyncRedis = require('async-redis');

@Injectable()
export class RedisService {
    refreshTokenRedis;

    constructor() {
        this.refreshTokenRedis = asyncRedis.createClient({
            host: config.REDIS.host,
            port: config.REDIS.port,
            db: config.REDIS.db,
          });
    }

    async get(token): Promise<number> {
        const userId = await this.refreshTokenRedis.get(token);
        console.log(userId);
        return userId;
    }

    async set(refreshToken, payload): Promise<void> {
        await this.refreshTokenRedis.set(
            refreshToken,
            payload,
            'EX',
            604800,
          );
    }

    del(token: string): Promise<void> {
        return this.refreshTokenRedis.del(token);
      }
}
