import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UploadMediaDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@src/common/guards/auth.guard';
import { Influencer } from '@src/common/decorators/user.decorator';
import { QueueService } from '@lib/queue/queue.service';
import { ConfigService } from '@src/lib/config/config.service';
import { TPostMessageQueueForML } from './entities/post.type';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private queueService: QueueService,
    private configService: ConfigService,
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Influencer('id') influencerId,
    @Body() createPostDto: CreatePostDto,
  ) {
    const post = await this.postsService.create({
      ...createPostDto,
      influencerId: influencerId,
    });
    //fetch trends from social channel and save to db for 1 hour to avoid api call
    // send to sqs queue for processing (producer code)

    const infPostMessage: TPostMessageQueueForML = {
      influencerId: post.influencerId,
      ...createPostDto,
      trends: {},
    };
    this.queueService.publish(
      infPostMessage,
      this.configService.get('ML_POST_INPUT_QUEUE'),
    );
    this.queueService.publish(
      infPostMessage,
      this.configService.get('ML_POST_INPUT_QUEUE'),
    );
    this.queueService.publish(
      infPostMessage,
      this.configService.get('ML_POST_INPUT_QUEUE'),
    );
    this.queueService.publish(
      infPostMessage,
      this.configService.get('ML_POST_INPUT_QUEUE'),
    );
    this.queueService.publish(
      infPostMessage,
      this.configService.get('ML_POST_INPUT_QUEUE'),
    );
    return {};
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  updatePost(
    @Influencer('id') influencerId,
    @Param('id') id,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const update = { $set: { ...updatePostDto, influencerId } };

    updatePostDto.description;

    return this.postsService.findByIdAndUpdate(id, update, { new: true });
  }

  @UseGuards(AuthGuard)
  @Post('media-upload')
  uploadMedia(
    @Influencer('id') influencerId,
    @Body() uploadMediaDto: UploadMediaDto,
  ) {
    return this.postsService.uploadMedia(influencerId, uploadMediaDto);
  }



}
