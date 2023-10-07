import { Injectable } from '@nestjs/common';
import { CreatePostDto, UploadMediaDto } from './dto/create-post.dto';
import { StorageService } from '@lib/storage/storage.service';
import { ConfigService } from '@lib/config/config.service';
import { Post, PostDocument } from './entities/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions, UpdateQuery } from 'mongoose';
// @InjectModel(Influencer.name)
// private readonly model: Model<InfluencerDocument>,
@Injectable()
export class PostsService {

  constructor(
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
    @InjectModel(Post.name)
    private readonly model: Model<PostDocument>,
  ) { }

  create(createPostDto: CreatePostDto & { influencerId: string }) {
    return this.model.create(createPostDto);
  }


  async findByIdAndUpdate(
    id: string,
    updateQuery: UpdateQuery<Post>,
    options: QueryOptions<Post> = {},
  ) {
    return this.model.findByIdAndUpdate(id, updateQuery, options);
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }

  async uploadMedia(influencerId: string, uploadMediaDto: UploadMediaDto) {
    const filePath = `${new Date().getFullYear()}/${influencerId}/${Date.now()}-${uploadMediaDto.fileName
      }`;
    const response = await this.storageService.uploadPresignedUrl(
      this.configService.get('AWS_BUCKET'),
      filePath,
      uploadMediaDto.contentType,
    );

    return {
      data: {
        url: response,
        filePath: filePath,
      },
    };
  }
}
