import { Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { SesService } from './email/ses.service';

@Module({
  providers: [EmailService, SesService],
  exports: [EmailService],
})
export class CommunicationModule {}

// comm could be any sender ses
