import { Global, Module } from '@nestjs/common';
import { AppJwtService } from './jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [JwtModule],
  providers: [AppJwtService],
  exports: [AppJwtService],
})
export class AppJwtModule {}
