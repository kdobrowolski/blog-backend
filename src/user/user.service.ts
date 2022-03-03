import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Knex } from 'knex';
import { UserDto, UserEmailDto, UserPasswordDto, UserFullNameDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { InjectKnex } from 'nestjs-knex'
import { RedisService } from "../redis/redis.service";
import config from '../../config/Config';
import { User } from "./user.interface";
import { UserExistsException } from "./exceptions/user-exists.exception";
import { RoleService } from "src/role/role.service";
import { UserUpdateException } from "./exceptions/user-update.exception";

@Injectable()
export class UserService {

  constructor(
    @InjectKnex() readonly knex: Knex,
    private readonly redisService: RedisService,
    private readonly roleService: RoleService
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

    const { roles, ...fields } = user;

    const createdUser = await this.knex<User>('users')
        .insert(fields)
        .onConflict('name').ignore();

    if (!createdUser[0]) {
      throw new UserExistsException('User exist!');
    }

    const userId = parseInt(createdUser[0]);

    await this.roleService.createRole(userId, roles);
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

  async updateUser(id: number, data: UserDto): Promise<void> {
    try {
      if (!Object.keys(data).length) {
        throw new BadRequestException('Object is empty!');
      }
      await this.knex.table<User>('users').where('id', id).update(data);
    } catch (err) {
      throw new UserUpdateException('Failed updating user');
    }
  }

  // CHANGE PASSWORD

  async changePassword(data: UserPasswordDto, id: number): Promise<void> {
    const res = await this.knex.table<User>('users').select('password').where('id', id).first();
    
    const oldMatch = await bcrypt.compare(data.oldPassword, res.password);

    if (!oldMatch) {
      throw new ConflictException('Wrong old password');
    }

    const saltOrRounds = config.BCRYPT.saltOrRounds;
    const hashedPassword = await bcrypt.hash(
      data.newPassword,
      parseInt(saltOrRounds),
    );

    await this.knex.table<User>('users').where('id', id).update({ password: hashedPassword });
  }
}
