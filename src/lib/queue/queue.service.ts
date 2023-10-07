import { Injectable } from '@nestjs/common';
import { SqsService } from './sqs.service';
import { IQueue } from './queue.interface';
@Injectable()
export class QueueService implements IQueue {
  constructor(private queueService: SqsService) {}

  publish(messageBody, queueUrl: string) {
    return this.queueService.publish(messageBody, queueUrl);
  }

  consume() {
    return this.queueService.consume();
  }
}
