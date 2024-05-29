import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { PRESIGNED_URL_PROVIDER_TOKEN } from './constants';
import { S3ProvidesService } from './3s-provides.service';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';

@Module({
  imports: [AwsSdkModule.forFeatures([S3])],
  controllers: [MediaController],
  providers: [
    MediaService,
    {
      provide: PRESIGNED_URL_PROVIDER_TOKEN,
      useClass: S3ProvidesService,
    },
  ],
})
export class MediaModule {}
