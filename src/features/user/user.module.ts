import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { CommunicationModule } from '@lib/communication/communication.module';
import { LibModule } from '@src/lib/lib.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          return UserSchema;
        },
      },
    ]),
    CommunicationModule,
    LibModule,
  ],
  controllers: [UserController],
  providers: [UserService],

  exports: [UserService],
})
export class UserModule { }
