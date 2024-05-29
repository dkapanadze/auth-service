import {
  BadRequestException,
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BaseUser, IUser, SignUpUser } from 'src/users/interfaces';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async localSignup(user: SignUpUser): Promise<IUser | null> {
    this.validateConfirmPasswords(user.password, user.repeatPassword);

    const hashedPassword = await argon.hash(user.password);

    try {
      const newUser = await this.usersService.createUser({
        ...user,
        password: hashedPassword,
      });

      this.logger.log(
        `new user created email ${newUser.email} id ${newUser.id}`,
      );

      return newUser;
    } catch (error) {
      console.log(error, 'error');
      if (error.code === '23505') {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCookieWithJwtToken(
    userId: number,
  ): Promise<{ cookie: string; token: string }> {
    const payload = { userId };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: `${this.configService.get('JWT_EXPIRATION_TIME')}s`,
    });

    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;

    return {
      cookie,
      token,
    };
  }

  async getCookieWithJwtRefreshToken(
    userId: number,
  ): Promise<{ cookie: string; token: string }> {
    const payload = { userId };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
    });

    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    )}`;

    return {
      cookie,
      token,
    };
  }

  async localSignin() {
    return 'Local signin';
  }

  async logout() {
    return 'Local logout';
  }

  async refreshTokens() {
    return 'Local logout';
  }

  public async getAuthorizedUser(
    email: string,
    password: string,
  ): Promise<BaseUser> {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.validatePassword(password, user.password);

    return user;
  }

  private validateConfirmPasswords(password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      throw new BadRequestException({ message: 'Passwords do not match' });
    }
  }

  private validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return argon.verify(hashedPassword, password).then((res) => {
      if (res) {
        return true;
      }
      throw new UnauthorizedException('invalid credentials');
    });
  }
}
