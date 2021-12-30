import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { UserRegisterDto } from './dto/user.dto';
import { UserService } from './user.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  registerUser(@Body() userRegisterDto: UserRegisterDto) {
    return this.userService.create(userRegisterDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(@Request() req, @Response({ passthrough: true }) res) {
    const resData = await this.authService.login(req.user);
    res.cookie('access_token', resData.access_token);
    res.cookie('refresh_token', resData.refresh_token, {
      httpOnly: true,
    });

    return resData;
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/me')
  authUser(@Request() req) {
    return req.user;
  }
}
