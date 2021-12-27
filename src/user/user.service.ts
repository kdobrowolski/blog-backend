import { ConflictException, Injectable } from "@nestjs/common";
import { Knex } from 'knex';
import { UserRegisterDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { InjectKnex } from 'nestjs-knex';

@Injectable()
export class UserService {
  constructor(@InjectKnex() readonly knex: Knex) {}

  async create(userRegisterDTO: UserRegisterDto) {
    console.log('dsaasd');
    const username = userRegisterDTO.username;
    const existUser = await this.knex
      .table('users')
      .where('username', username)
      .first();
    if (existUser.length != 0) {
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
    };

    const createdUser = await this.knex.table('users').insert(user);

    return { createdUser, msg: 'User created!' };
  }
}
