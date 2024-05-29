import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { TokenEntity, UserEntity } from './users/entities';
import { S3 } from 'aws-sdk';
import { CronModule } from './cron/cron.module';
import { LoggerModule } from './logger/logger.module';
import { AwsSdkModule } from 'nest-aws-sdk';
import { MediaModule } from './media/media.module';
import { KafkaModule } from './kafka/kafka.module';
import { ProxyModule } from './proxy/proxy.module';
import { ProxyController } from './proxy/proxy.controller';

const envFilePath =
  process.env.NODE_ENV === 'test' ? '.env.test' : '.env.development';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().required(),
        PORT: Joi.number().required(),
        DB_TYPE: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.number().required(),
        JWT_EXPIRATION_TIME: Joi.number().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get<'sqlite' | 'postgres'>('DB_TYPE'),
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          ssl: {
            rejectUnauthorized: false,
          },
          entities: [UserEntity, TokenEntity],
          synchronize: true,
        } as TypeOrmModuleOptions;
      },
    }),
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory(configService: ConfigService) {
          return {
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_SECRET'),
            region: configService.get('AWS_REGION'),
          };
        },
      },
      services: [S3],
    }),
    // UsersModule,
    KafkaModule,
    AuthModule,
    CronModule,
    LoggerModule,
    MediaModule,
    ProxyModule,
  ],
  providers: [AppService],
  controllers: [ProxyController],
})
export class AppModule {}
// ccs
