import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  UsePipes,
  ValidationPipe,
  Req,
  HttpCode,
  UseGuards,
  Get,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { BaseUser, IUser } from 'src/users/interfaces';
import { RequestWithUser } from './interfaces';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { LogoutInterceptor } from './interceptors';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { UserEntity } from '../users/entities/user.entity';
import { ProducerService } from 'src/kafka/producer.service';
import { EventPattern } from '@nestjs/microservices';

@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    // private readonly producerService: ProducerService,
  ) {}

  @Post('/local/signup')
  @ApiCreatedResponse({
    description: 'created user object ras response',
    type: UserEntity,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe({ transform: true }))
  @EventPattern('user_create')
  async localSignup(
    @Body() registrationData: AuthDto,
    @Req() request: RequestWithUser<BaseUser>,
  ): Promise<BaseUser> {
    const user = await this.authService.localSignup(registrationData);

    const { cookie: accessCookie } =
      await this.authService.getCookieWithJwtToken(user.id);
    const { cookie, token } =
      await this.authService.getCookieWithJwtRefreshToken(user.id);

    // this.producerService.produce({
    //   topic: 'user_create',
    //   messages: [{ value: JSON.stringify(user) }],
    // });

    request.res.setHeader('Set-Cookie', [accessCookie, cookie]);

    return user;
  }

  @Post('/local/signin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async localSignin(@Request() { user, res }: RequestWithUser<IUser>) {
    const { cookie: accessCookie } =
      await this.authService.getCookieWithJwtToken(user.id);

    const { cookie, token } =
      await this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.userService.setHashedRefreshToken(user.id, token);

    res.setHeader('Set-Cookie', [accessCookie, cookie]);

    return user;
  }

  @Get('/logout')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(LogoutInterceptor)
  async logout(@Request() request: RequestWithUser<IUser>) {
    const refreshToken = request.cookies['Refresh'];

    return this.userService.removeRefreshToken(request.user.id, refreshToken);
  }

  @Get('/test')
  @UseGuards(JwtAuthGuard)
  async profile(@Request() request: RequestWithUser<IUser>) {
    return 'test';
  }

  @Get('/refresh')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard('jwt-refresh-token'))
  async refreshTokens(
    @Request() { user, res }: RequestWithUser<BaseUser>,
  ): Promise<BaseUser> {
    const accessCookie = await this.authService.getCookieWithJwtToken(user.id);

    res.setHeader('Set-Cookie', accessCookie.cookie);

    return user;
  }
}
