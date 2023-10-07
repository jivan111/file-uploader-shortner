import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { SqsService } from './sqs.service';

@Module({
  providers: [QueueService, SqsService],
  exports: [QueueService],
})
export class QueueModule {}
