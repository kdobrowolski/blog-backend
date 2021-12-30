import { Controller, Post, Request, Response, UnauthorizedException } from "@nestjs/common";
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('refreshToken')
  async refreshToken(@Request() req, @Response({ passthrough: true }) res): Promise<any> {
    const refreshToken = req.cookies['refresh_token'];
    const user = await this.userService.findUserByRefreshToken(refreshToken);

    if (!user) {
      throw new UnauthorizedException('auth_token_expired');
    }

    const { access_token, refresh_token } = await this.authService.login(user);

    await this.userService.deleteRefreshToken(refreshToken);
    res.cookie('access_token', access_token);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
    });

    return {
      access_token,
      refresh_token,
    };
  }
}
