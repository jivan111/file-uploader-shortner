import { Injectable } from '@nestjs/common';
import { ISendEmail, SendEmailProp } from '../interface/email.interface';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@src/lib/config/config.service';

const ses = new AWS.SES({
  apiVersion: '2010-12-01',
  region: 'us-east-1',
});

@Injectable()
export class SesService implements ISendEmail {
  constructor(private readonly configService: ConfigService) {}

  async sendEmail(payload: SendEmailProp) {
    const { emails, subject, message } = payload;
    const params: AWS.SES.SendEmailRequest = {
      Source: `Aether Pantheon <${this.configService.get('SENDER_EMAIL')}>`,
      Destination: {
        ToAddresses: emails,
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Text: {
            Data: message,
          },
        },
      },
    };

    return ses.sendEmail(params).promise();
  }
}
