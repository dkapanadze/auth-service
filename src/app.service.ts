import { Injectable } from '@nestjs/common';
import { ProducerService } from './kafka/producer.service';

@Injectable()
export class AppService {
  constructor() {}
  async getHello() {
    return 'Hello World! 2';
  }
}
