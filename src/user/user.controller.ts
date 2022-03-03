import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Delete, Param, Put, ParseIntPipe, ForbiddenException
} from '@nestjs/common';
import { UserDto, UserPasswordDto, UserEmailDto, UserFullNameDto } from './dto/user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthedUser } from './user.decorator';
import { Action, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { UserExistsException } from './exceptions/user-exists.exception';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private caslAbilityFactory: CaslAbilityFactory
  ) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  async registerUser(@AuthedUser() user, @Body() userDto: UserDto): Promise<any> {

    try {
      const userWithRoles = await this.userService.findUserWithRoles(user);

      const ability = await this.caslAbilityFactory.createForUser(userWithRoles.roles);

      if (ability.can(Action.Create, 'User')) {
        return await this.userService.create(userDto);
      } else {
        throw new ForbiddenException('forbidden_resources');
      }
    } catch (err) {
      switch (err.constructor) {
        case UserExistsException:
          throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException();

    }
  }

  @Get('moderator')
  getModerator() {
    return this.userService.getModerator();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@AuthedUser() user, @Param('id', ParseIntPipe) id): Promise<any> {
    
    const userWithRoles = await this.userService.findUserWithRoles(user);

    const ability = await this.caslAbilityFactory.createForUser(userWithRoles.roles);

    if (ability.can(Action.Delete, 'User')) {
      return this.userService.deleteUserById(id);
    } else {
      throw new ForbiddenException('forbidden_resources');
    }
  }

  @Put(':id/fullname')
  changeFullName(@Param('id', ParseIntPipe) id: number, @Body() data: UserFullNameDto): any {
    return this.userService.changeFullname(data, id);
  }

  @Put(':id/email')
  changeEmail(@Param('id', ParseIntPipe) id: number, @Body() data: UserEmailDto): any {
    return this.userService.changeEmail(data, id);
  }

  @Put(':id/password')
  changePassword(@Param('id', ParseIntPipe) id: number, @Body() data: UserPasswordDto): any {
    return this.userService.changePassword(data, id);
  }
}

