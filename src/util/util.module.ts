import { Global, Module } from '@nestjs/common';
import { CommonUtilService } from './common-util.service';

@Global()
@Module({
  providers: [CommonUtilService],
  exports: [CommonUtilService],
})
export class UtilModule {}
