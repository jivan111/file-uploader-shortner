import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@lib/config/config.service';
import { Server } from './server';

async function bootstrap() {
  const config = new ConfigService();

  const app = await NestFactory.create(AppModule);
  // boot methods startup the application, and initialize the port
  // for incoming requet
  // await app.listen(3000);
  Server.init(app, config).configure().boot();
}

bootstrap();
