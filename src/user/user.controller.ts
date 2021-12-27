import { Controller, Post, Body } from '@nestjs/common';
import { UserRegisterDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  registerUser(@Body() userRegisterDto: UserRegisterDto) {
    console.log('dsaads');
    return this.userService.create(userRegisterDto);
  }
}
