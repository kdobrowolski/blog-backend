import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Knex } from 'knex';
import { UserRegisterDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { InjectKnex } from 'nestjs-knex';
import config from '../../config/Config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const asyncRedis = require('async-redis');

@Injectable()
export class UserService {
  refreshTokenRedis;

  constructor(@InjectKnex() readonly knex: Knex) {
    this.refreshTokenRedis = asyncRedis.createClient({
      host: '127.0.0.1',
      port: 6379,
      db: 1,
    });
  }

  async create(userRegisterDTO: UserRegisterDto) {
    const username = userRegisterDTO.username;
    const existUser = await this.knex
      .table('users')
      .where('username', username)
      .first();
    if (existUser) {
      throw new ConflictException('User already exist');
    }
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      userRegisterDTO.password,
      saltOrRounds,
    );

    const user = {
      username: username,
      email: userRegisterDTO.email,
      password: hashedPassword,
      firstName: userRegisterDTO.firstName,
      lastName: userRegisterDTO.lastName,
      isAdmin: userRegisterDTO.isAdmin,
    };

    const createdUser = await this.knex.table('users').insert(user);

    return { createdUser, msg: 'User created!' };
  }

  async findOne(username: string) {
    const user = await this.knex
      .table('users')
      .where('username', username)
      .first();
    if (!user) {
      throw new ConflictException('User doesnt exist!');
    }
    return { user };
  }

  async findUserByRefreshToken(token: string) {
    const userId = await this.refreshTokenRedis.get(token);

    if (!userId) {
      return null;
    }
    const user = await this.knex.table('users').where('id', userId).first();
    return user;
  }

  deleteRefreshToken(token: string) {
    return this.refreshTokenRedis.del(token);
  }
}
