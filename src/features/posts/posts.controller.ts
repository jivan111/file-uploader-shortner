import {
  Controller,
  Post,
  Put,
  Body,
  Get,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
  Redirect,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UploadMediaDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@src/common/guards/auth.guard';
import { User } from '@src/common/decorators/user.decorator';
import ShortUniqueId from 'short-unique-id';
import { Invali_Short_Code } from '@src/constants/errors';




@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService
  ) { }



  @UseGuards(AuthGuard)
  @Post('media-upload')
  async uploadMedia(
    @User('id') userId,
    @Body() uploadMediaDto: UploadMediaDto,
  ) {
    let uploadedData = await this.postsService.uploadMedia(userId, uploadMediaDto);
    const uid = new ShortUniqueId({ length: 8 });
    // console.log(uid, "fdsflkds");
    let createPostDto = {

      userId: userId,

      fileUrl: uploadedData.data.fileUrl,

      fileType: uploadMediaDto.contentType,

      fileName: uploadMediaDto.fileName,

      fileSize: uploadMediaDto.fileSize,

      shortUrlCode: uid.rnd()
    }
    const post = await this.postsService.create(createPostDto);

    return uploadedData
  }

  @Get(":shortUrlCode")
  @Redirect('https://docs.nestjs.com', 302)

  async redirectmedia(@Param("shortUrlCode") shortUrlCode) {

    let media = await this.postsService.findOne({ shortUrlCode })
    if (media == null)
      throw new HttpException(Invali_Short_Code, HttpStatus.NOT_FOUND);

    return { url: media.fileUrl };

  }


  @UseGuards(AuthGuard)
  @Get()
  async getMedia(
    @User('id') userId
  ) {

    const post = await this.postsService.find({ userId: userId });

    return { data: post }
  }



}
