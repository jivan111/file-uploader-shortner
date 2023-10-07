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
import { User } from '@src/common/decorators/user.decorator';


@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @User('id') userId,
    @Body() createPostDto: CreatePostDto,
  ) {
    const post = await this.postsService.create({
      ...createPostDto,
      userId: userId,
    });
    //fetch trends from social channel and save to db for 1 hour to avoid api call
    // send to sqs queue for processing (producer code)


    return {};
  }



  @UseGuards(AuthGuard)
  @Post('media-upload')
  uploadMedia(
    @User('id') userId,
    @Body() uploadMediaDto: UploadMediaDto,
  ) {
    return this.postsService.uploadMedia(userId, uploadMediaDto);
  }



}
