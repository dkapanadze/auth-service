import { Injectable } from '@nestjs/common';
import { BaseUser, IToken, IUser, SignUpUser } from './interfaces';
import { UserRepository } from './repositories/user.repository';
import * as argon from 'argon2';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  async createUser(user: SignUpUser): Promise<IUser> {
    const newUser = await this.userRepository.createUser(user);

    return newUser;
  }

  async getUserByEmail(email: string): Promise<IUser> {
    return this.userRepository.getUserByEmail(email);
  }

  async find(): Promise<IUser[]> {
    return this.userRepository.find();
  }

  async getById(userIdd: number): Promise<IUser> {
    return this.userRepository.getById(userIdd);
  }

  async setHashedRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<IToken> {
    const hashedRefreshToken = await argon.hash(refreshToken);
    return this.userRepository.setHashedRefreshToken(
      userId,
      hashedRefreshToken,
    );
  }

  async removeRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    return await this.userRepository.removeRefreshToken(userId, refreshToken);
  }

  async getByRefreshToken(userId: number, refreshToken: string) {
    return this.userRepository.getByRefreshToken(userId, refreshToken);
  }

  async deleteExpiredTokens() {
    return this.userRepository.deleteExpiredTokens();
  }
}
