import { Injectable } from '@nestjs/common';
import { IConfig } from '@src/interfaces/config.interface';
import * as Joi from 'joi';
import { config } from 'dotenv';

config();

const APP_CONFIGURATION: IConfig = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: Number(process.env.PORT),

  DATABASE_URI: process.env.DATABASE_URI,
  JWT_EXPIRES_AT: process.env.JWT_EXPIRES_AT,
  JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY,
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
  JWT_ISSUER: process.env.JWT_ISSUER,
  JWT_AUDIENCE: process.env.JWT_AUDIENCE,

  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  SENDER_EMAIL: process.env.SENDER_EMAIL,
  AWS_BUCKET: process.env.AWS_BUCKET,
  OTP_LEN: Number(process.env.OTP_LEN),

};

const ConfigSchema = Joi.object<IConfig>({
  NODE_ENV: Joi.string().required(),
  PORT: Joi.number().required(),
  DATABASE_URI: Joi.string().required(),
  JWT_ISSUER: Joi.string().required(),
  JWT_AUDIENCE: Joi.string().required(),
  JWT_EXPIRES_AT: Joi.string().required(),
  JWT_PUBLIC_KEY: Joi.string().required(),
  JWT_PRIVATE_KEY: Joi.string().required(),
  SENDER_EMAIL: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_BUCKET: Joi.string().required(),
  OTP_LEN: Joi.number().required(),
});

@Injectable()
export class ConfigService {
  private config?: IConfig;

  constructor() {
    this.config = this.validate();
  }

  private validate() {
    const { error, value } = ConfigSchema.validate(APP_CONFIGURATION);

    const messages = error && error.details.map((detail) => detail.message);

    if (messages && messages.length > 0) {
      throw new Error(`\n ${messages.join('\n')}`);
    }

    return value;
  }

  get<K extends keyof IConfig>(key: K): IConfig[K] {
    return this.config[key];
  }
}
