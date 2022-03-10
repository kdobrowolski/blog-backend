import { Controller, Get, Post, Request, Response, UnauthorizedException, UseGuards } from "@nestjs/common";
import { RedisService } from "src/redis/redis.service";
import { AuthedUser } from "src/user/user.decorator";
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from "./local-auth.guard";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async authUser(@AuthedUser() user): Promise<Record<string,any>> {
    const userWithRoles = await this.userService.findUserWithRoles(user);
    return userWithRoles;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(@Request() req, @Response({ passthrough: true }) res): Promise<Record<string,any>> {
    const data = await this.authService.generateTokenPairs(req.user);

    res.cookie('access_token', data.accessToken, {
      expires: new Date(Date.now() + 300000),
      path: '/'
    });
    res.cookie('refresh_token', data.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 604800000),
      path: '/'
    });

    return { data };
  }

  @Post('logout')
  async logout(@Request() req, @Response({ passthrough: true }) res): Promise<void> {
    const refreshToken = await req.cookies['refresh_token'];
    await this.redisService.del(refreshToken);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }

  @Post('refreshToken')
  async refreshToken(@Request() req, @Response({ passthrough: true }) res): Promise<Record<string,any>> {
    const refreshTokenCookie = req.cookies['refresh_token'];
    
    if (!refreshTokenCookie) {
      throw new UnauthorizedException('auth_token_expired');
    }

    const user = await this.userService.findUserByRefreshToken(refreshTokenCookie);
    
    if (!user) {
      throw new UnauthorizedException('auth_token_expired');
    }

    const { accessToken, refreshToken } = await this.authService.generateTokenPairs(user);
    await this.redisService.del(refreshTokenCookie);

    res.cookie('access_token', accessToken, {
      expires: new Date(Date.now() + 300000),
      path: '/'
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 604800000),
      path: '/'
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
