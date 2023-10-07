import { Module } from '@nestjs/common';
import { UserModule } from './features/user/user.module';
import { LibModule } from './lib/lib.module';
import { UtilModule } from './util/util.module';
import { PostsModule } from './features/posts/posts.module';

@Module({
  imports: [
    UserModule,
    LibModule,
    UtilModule,
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
