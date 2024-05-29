import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class CronService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}
  //   @Cron('* * * * * *')
  async handleCron() {
    const res = await this.userService.deleteExpiredTokens();
    if (!res) {
      console.log('No expired tokens found');
    } else {
      console.log(' res expired tokens deleted');
    }
  }
}
