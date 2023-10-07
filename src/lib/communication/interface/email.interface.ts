export interface ISendEmail {
  sendEmail(payload: SendEmailProp);
}

export interface SendEmailProp {
  emails: string[];
  subject: string;
  message: string;
  userId?: string;
}
