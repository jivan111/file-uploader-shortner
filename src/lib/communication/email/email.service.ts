import { Injectable } from '@nestjs/common';
import { ISendEmail, SendEmailProp } from '../interface/email.interface';
import { SesService } from './ses.service';

@Injectable()
export class EmailService implements ISendEmail {
  constructor(private emailService: SesService) {}

  sendEmail(payload: SendEmailProp) {
    return this.emailService.sendEmail(payload);
  }
}
