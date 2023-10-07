import { Module, DynamicModule, Global } from '@nestjs/common';
import { ConfigService } from './config.service';
@Global()
@Module({})
export class ConfigModule {
  static register(): DynamicModule {
    return {
      module: ConfigModule,
      providers: [ConfigService],
      exports: [ConfigService],
    };
  }
}
