import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AllExceptionsFilter } from './error-handling';
import { KafkaOptions, Transport } from '@nestjs/microservices';
import * as fs from 'fs';
import * as morgan from 'morgan';

const logStream = fs.createWriteStream('./api.log', { flags: 'a' });
// tdd
dotenv.config();

export const kafkaClientOptions: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'my-app',
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: 'my-consumer-' + Math.random(), // unique consumer group
    },
  },
};
async function bootstrap() {
  //add unhandled exception handler
  process.on('uncaughtException', (err) => {
    console.log('uncaughtException', err);
  });
  process.on('unhandledRejection', (err) => {
    console.log('unhandledRejection', err);
  });
  process.on('exit', (code) => {
    console.log(`About to exit with code: ${code}`);
  });

  morgan.token('host', function (req, res) {
    return req.hostname;
  });
  const app = await NestFactory.create(AppModule);

  app.use(
    morgan(
      ':host :method  :url  :status :res[content-length] - :response-time ms',
    ),
  );

  app.use(morgan('combined', { stream: logStream }));

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  app.use(cookieParser());
  app.useGlobalFilters(new AllExceptionsFilter());
  // const kafkaMicroservice =
  //   app.connectMicroservice<MicroserviceOptions>(kafkaClientOptions);

  await app.startAllMicroservices();

  const PORT = process.env.PORT || 8001;
  await app.listen(PORT, () => {
    console.log(
      `${process.env.NODE_ENV}-server running on server http://localhost:${PORT} 🚀🚀🚀`,
    );
  });
}
bootstrap();
