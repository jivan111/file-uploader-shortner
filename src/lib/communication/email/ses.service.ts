import { Injectable } from '@nestjs/common';
import { ISendEmail, SendEmailProp } from '../interface/email.interface';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@src/lib/config/config.service';



@Injectable()
export class SesService implements ISendEmail {

  ses: any
  constructor(private readonly configService: ConfigService) {
    this.ses = new AWS.SES({
      apiVersion: '2010-12-01',
      region: 'us-east-1',
      accessKeyId: this.configService.get("AWS_ACCESS_KEY_ID"),
      secretAccessKey: this.configService.get("AWS_SECRET_ACCESS_KEY"),

    });
  }

  async sendEmail(payload: SendEmailProp) {
    const { emails, subject, message } = payload;
    const params: AWS.SES.SendEmailRequest = {
      Source: `<${this.configService.get('SENDER_EMAIL')}>`,
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

    return this.ses.sendEmail(params).promise();
  }
}
