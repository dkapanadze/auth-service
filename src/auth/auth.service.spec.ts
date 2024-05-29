import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../logger/logger.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { IUser } from 'src/users/interfaces';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;
  beforeEach(async () => {
    const users: IUser[] = [];
    fakeUserService = {
      find: () => Promise.resolve([]),
      getUserByEmail: (email: string) => {
        const filteredUsers = users.find((user) => user.email === email);
        return Promise.resolve(filteredUsers || null);
      },
      createUser: ({ email, name, password }) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          name,
          password,
          createdAt: new Date(),
          isDeleted: false,
          deletedAt: null,
          hashedRefreshTokens: [],
        } as IUser;
        users.push(user);

        return Promise.resolve(user);
      },
      // Promise.resolve({
      //   id: 1,
      //   email,
      //   name,
      //   password,
      //   createdAt: new Date(),
      //   isDeleted: false,
      //   deletedAt: null,
      //   hashedRefreshTokens: [],
      // }),
    };

    const fakeLoggerService: Partial<LoggerService> = {
      log: () => console.log(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn(), verify: jest.fn() }, // mock JwtService here
        },
        {
          provide: ConfigService,
          useValue: {}, // mock ConfigService here if needed
        },
        {
          provide: LoggerService,
          useValue: fakeLoggerService, // mock LoggerService here if needed
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('can crate a  instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with ', async () => {
    const userObj = {
      email: 'test@gmail.com',
      name: 'saxeli',
      password: 'password',
      repeatPassword: 'password',
    };
    const user = await service.localSignup(userObj);

    expect(user.password).not.toEqual(userObj.password);
    expect(user.email).toEqual(userObj.email);
    expect(user.name).toEqual(userObj.name);
    expect(user.name).toEqual(userObj.name);
    expect(user.isDeleted).toEqual(false);
    expect(user.deletedAt).toEqual(null);
  });

  it('throws error if passwords do not match', async () => {
    const userObj = {
      email: 'test@gmail.com',
      name: 'saxeli',
      password: 'password',
      repeatPassword: 'passwordd',
    };

    await expect(service.localSignup(userObj)).rejects.toThrow(
      BadRequestException,
    );
  });

  it(' throw if sign in with unexisting user', async () => {
    await expect(
      service.getAuthorizedUser('test@gmail.com', 'password'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('return user if correct password is provided', async () => {
    await service.localSignup({
      email: 'test@gmail.com',
      password: 'password',
      repeatPassword: 'password',
      name: 'name',
    });

    const user = await service.getAuthorizedUser('test@gmail.com', 'password');
    expect(user).toBeDefined;
  });

  it('throws if wrong password is provided', async () => {
    await service.localSignup({
      email: 'test2@gmail.com',
      password: 'password',
      repeatPassword: 'password',
      name: 'name',
    });

    await expect(
      service.getAuthorizedUser('test2@gmail.com', 'wrongpassword'),
    ).rejects.toThrow(UnauthorizedException);
  });
});
