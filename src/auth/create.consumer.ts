import { Injectable, OnModuleInit } from '@nestjs/common';
import { async } from 'rxjs';
import { ConsumerService } from 'src/kafka/consumer.service';

@Injectable()
export class CreateConsumer implements OnModuleInit {
  constructor(private readonly createConsumer: ConsumerService) {}

  onModuleInit() {
    this.createConsumer.consume('create-client', 'user_create', {
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          source: 'create-consumer',
          message: message.value.toString(),
          partition: partition.toString(),
          topic: topic.toString(),
        });
      },
    });
  }
}
