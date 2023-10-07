import { Injectable } from '@nestjs/common';
import { IQueue } from './queue.interface';
import * as AWS from 'aws-sdk';
AWS.config.update({});

const SQS = new AWS.SQS({ apiVersion: '2012-11-05', region: 'us-east-1' });

@Injectable()
export class SqsService implements IQueue {
  // MessageAttributes is a metadata about messages and can have upto 10 attributes
  async publish(messageBody, queueUrl: string) {
    const resp = await SQS.sendMessage({
      MessageBody: JSON.stringify(messageBody),
      QueueUrl: queueUrl,
    }).promise();
    console.log(resp);
    return resp;
  }
  async consume() {
    const qUrl =
      'https://sqs.us-east-1.amazonaws.com/556485867350/PostContentByML';
    const params = {
      AttributeNames: ['SentTimestamp'],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: ['All'],
      QueueUrl: qUrl,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 0,
    };

    const messages = await SQS.receiveMessage(params).promise();
    console.log(messages, 'fdmflkdfkln');
    if (messages.Messages) {
      const deleteParams = {
        QueueUrl: qUrl,
        ReceiptHandle: messages.Messages[0].ReceiptHandle,
      };
      await SQS.deleteMessage(deleteParams).promise();
    }
    return Promise.resolve('Resolved');
  }
}

new SqsService().consume().then(console.log).catch(console.log);
