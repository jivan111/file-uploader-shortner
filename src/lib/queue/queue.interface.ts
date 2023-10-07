export interface IQueue {
  publish(messageBody, queueUrl: string);

  consume();
}
