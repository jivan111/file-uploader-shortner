export interface IConfig {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URI: string;
  JWT_ISSUER: string;
  JWT_AUDIENCE: string;
  JWT_EXPIRES_AT: string;
  JWT_PUBLIC_KEY: string;
  JWT_PRIVATE_KEY: string;

  AWS_SECRET_ACCESS_KEY: string;
  AWS_ACCESS_KEY_ID: string;
  SENDER_EMAIL: string;
  AWS_BUCKET: string;
  OTP_LEN: number;
}
