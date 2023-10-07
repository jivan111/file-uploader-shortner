import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { CommunicationModule } from './communication/communication.module';
import { AppJwtModule } from './jwt/jwt.module';
import { StorageModule } from './storage/storage.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.register(),
    DatabaseModule.register(),
    CommunicationModule,
    AppJwtModule,
    StorageModule,
    QueueModule,
  ],
  providers: [],
  exports: [],
})
export class LibModule {}
