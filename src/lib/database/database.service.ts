import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigService } from '../config/config.service';

@Injectable()
export class DatabaseService {
  constructor(private readonly configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.configService.get('DATABASE_URI'),
      retryAttempts: 3,
      retryDelay: 10,
    };
  }
}
