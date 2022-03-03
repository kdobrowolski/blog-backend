import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Knex } from 'knex';
import { UserDto, UserEmailDto, UserPasswordDto, UserFullNameDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { InjectKnex } from 'nestjs-knex'
import { RedisService } from "../redis/redis.service";
import config from '../../config/Config';
import { User } from "./user.interface";
import { UserExistsException } from "./exceptions/user-exists.exception";

@Injectable()
export class UserService {

  constructor(
    @InjectKnex() readonly knex: Knex,
    private redisService: RedisService
  ) {}

  // GET MODERATORS

  async getModerator(): Promise<Record<string,any>> {
    const moderators = await this.knex.table<User>('users')
      .select('id', 'firstName', 'lastName', 'name', 'email')
      .leftJoin('roles', 'users.id', 'roles.userId')
      .where('role', 'Moderator');

    return { moderators };
  }

  // CREATE USER

  async create(user: UserDto): Promise<void> {

    const saltOrRounds = config.BCRYPT.saltOrRounds;
    
    user.password = await bcrypt.hash(
      user.password,
      parseInt(saltOrRounds),
    );

    const { name, email, password, firstName, lastName } = user;

    const userObj = {
      name,
      email,
      password,
      firstName,
      lastName
    }

    const createdUser = await this.knex<User>('users')
        .insert(userObj)
        .onConflict('name').ignore();

    if (!createdUser[0]) {
      throw new UserExistsException('User exist!');
    }

    const userId = parseInt(createdUser[0]);

    await this.createRole(userId, user.roles);
  }

  async createRole(id: number, roles: Array<string>): Promise<void> {
    roles.forEach(async role => {

      const roleObj = {
        userId: id,
        role
      }
      
      await this.knex('roles').insert(roleObj)
    })
  }

  // FIND USER

  async findOneByUsername(username: string): Promise<Record<string,any>> {
    const user = await this.knex
      .table<User>('users')
      .where('name', username)
      .first();
    if (!user) {
      throw new NotFoundException('User doesnt exist!');
    }
    return { user };
  }

  async findOneById(id: number): Promise<Record<string,any>> {
    const user = await this.knex
      .table<User>('users')
      .where('id', id)
      .first();
    if (!user) {
      throw new NotFoundException('User doesnt exist!');
    }
    return { user };
  }

  // FIND USER BY REFRESH TOKEN

  async findUserByRefreshToken(token: string): Promise<Record<string,any>> {
    const userId = await this.redisService.get(token);
    if (!userId) {
      return null;
    }
    const user = await this.knex.table<User>('users').where('id', userId).first();
    return user;
  }

  async findUserWithRoles(user) {
    const roles = await this.knex
      .table('roles')
      .where('userId', user.id);

    let rolesArr = [];

    roles.forEach(item => {
      rolesArr.push(item.role);
    })

    return {
      ...user,
      roles: rolesArr
    }
  }

  // DELETE USER BY ID

  deleteUserById(id: number): Promise<void> {
    return this.knex.table<User>('users').where('id', id).del();
  }

  // CHANGE FULLNAME

  async changeFullname(data: UserFullNameDto, id: number): Promise<void> {
    await this.knex.table<User>('users').where('id', id).update({ firstName: data.firstName, lastName: data.lastName });
  }

  // CHANGE EMAIL

  async changeEmail(data: UserEmailDto, id: number): Promise<void> {
    await this.knex.table<User>('users').where('id', id).update({ email: data.email });
  }

  // CHANGE PASSWORD

  async changePassword(data: UserPasswordDto, id: number): Promise<void> {
    const res = await this.knex.table<User>('users').select('password').where('id', id).first();

    const oldMatch = await bcrypt.compare(data.oldPassword, res.password);

    if (!oldMatch) {
      throw new ConflictException('Wrong old password');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      data.newPassword,
      saltOrRounds,
    );

    await this.knex.table<User>('users').where('id', id).update({ password: hashedPassword });
  }
}
