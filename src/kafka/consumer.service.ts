import { Injectable } from '@nestjs/common';

import { Consumer, ConsumerRunConfig, Kafka } from 'kafkajs';

@Injectable()
// implements OnModuleInit, OnModuleDestroy
export class ConsumerService {
  constructor() {} // @Inject('KAFKA_SERVICE') private readonly clientKafka: ClientKafka,

  // public async onModuleInit() {
  //   await this.clientKafka.connect();
  // }

  // @MessagePattern('user_create')
  // public async handleMessage(@Payload() message: string): Promise<void> {
  //   // Handle the received message
  //   console.log('handleMessage');
  //   console.log('Received message:', message);
  // }

  // public async onModuleDestroy() {
  //   await this.clientKafka.close();
  // }

  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
  });

  private readonly consumers: Consumer[] = [];

  public async onModuleInit() {}

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }

  async consume(groupId: string, topic: string, config: ConsumerRunConfig) {
    const consumer: Consumer = this.kafka.consumer({ groupId });
    this.consumers.push(consumer);
    await consumer.connect().catch((e) => {
      console.error(e, 'error subscribing to topic');
    });
    await consumer.subscribe({ topic });
    await consumer.run(config);
    // await consumer.run({
    //   eachMessage: async ({ topic, partition, message }) => {
    //     console.log({
    //       value: message.value.toString(),
    //     });
    //   },
    // });
    this.consumers.push(consumer);
  }
}
