import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual } from 'typeorm';
import { Repository } from 'typeorm';
import { TokenEntity, UserEntity } from '../entities';
import { ConfigService } from '@nestjs/config';
import { BaseUser, IToken, IUser, SignUpUser } from '../interfaces';
import * as argon from 'argon2';
import { promises } from 'dns';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
  ) {}

  public async createUser(user: SignUpUser): Promise<IUser> {
    const newUser = this.userRepository.create(user);

    return await this.userRepository.save(newUser);
  }

  public async getUserByEmail(email: string): Promise<IUser> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  public async setHashedRefreshToken(
    userId: number,
    hashedRefreshToken: string,
  ): Promise<IToken> {
    const expiresAt = this.addSecondsToCurrentDate(360000);

    const newToken = this.tokenRepository.create({
      user: { id: userId },
      hashedToken: hashedRefreshToken,
      expiresAt,
    });

    return await this.tokenRepository.save(newToken);
  }
  public addSecondsToCurrentDate(seconds: number): Date {
    const currentDate = new Date();

    const newDate = new Date(currentDate.getTime() + seconds * 1000);

    return newDate;
  }
  public async getById(id: number): Promise<IUser> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  public async getByRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<IUser | null> {
    const tokens = await this.tokenRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    const checkToken = await Promise.all(
      tokens.map(async (token) => {
        const check = await argon.verify(token.hashedToken, refreshToken);
        if (check) {
          return token;
        }
      }),
    );
    const foundToken = checkToken.find((token) => token);

    if (foundToken) {
      return foundToken.user;
    }
    return null;
  }

  public async deleteExpiredTokens(): Promise<number> {
    const currentDate = new Date();
    return await this.tokenRepository
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :currentDate', { currentDate })
      .execute()
      .then((res) => {
        return res.affected;
      });
  }
  public async find(): Promise<IUser[]> {
    return await this.userRepository.find();
  }
  public async removeRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const tokens = await this.tokenRepository.find({
      where: { user: { id: userId } },
    });
    tokens.forEach(async (token) => {
      if (await argon.verify(token.hashedToken, refreshToken)) {
        return await this.tokenRepository.delete(token.id);
      }
    });
  }
}
