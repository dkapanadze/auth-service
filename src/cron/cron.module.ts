import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ScheduleModule.forRoot(), UsersModule],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
