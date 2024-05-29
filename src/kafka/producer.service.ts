import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
// implements OnModuleInit, OnModuleDestroy
export class ProducerService implements OnApplicationShutdown, OnModuleInit {
  constructor() {} // @Inject('KAFKA_SERVICE') private readonly clientKafka: ClientKafka,

  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
  });

  private readonly producer: Producer = this.kafka.producer();

  public async onModuleInit() {
    await this.producer.connect();
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }

  async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }

  // public async produceTestMessage(topic: string, message: any) {
  //   console.log(message, 'message');
  //   return await this.clientKafka.emit(topic, message);
  // }

  // public async onModuleDestroy() {
  //   await this.clientKafka.close();
  // }
}
