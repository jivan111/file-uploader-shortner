import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { StorageModule } from '@lib/storage/storage.module';
import { UserModule } from '@features/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity';
import { QueueModule } from '@lib/queue/queue.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Post.name,
        useFactory: () => {
          return PostSchema;
        },
      },
    ]),
    StorageModule,
    UserModule,
    QueueModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule { }
