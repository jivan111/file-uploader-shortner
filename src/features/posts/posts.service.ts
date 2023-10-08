import { Injectable } from '@nestjs/common';
import { CreatePostDto, UploadMediaDto } from './dto/create-post.dto';
import { StorageService } from '@lib/storage/storage.service';
import { ConfigService } from '@lib/config/config.service';
import { Post, PostDocument } from './entities/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions, UpdateQuery } from 'mongoose';

@Injectable()
export class PostsService {

  constructor(
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
    @InjectModel(Post.name)
    private readonly model: Model<PostDocument>,
  ) { }

  create(createPostDto: CreatePostDto & { userId: string }) {
    return this.model.create(createPostDto);
  }


  async findByIdAndUpdate(
    id: string,
    updateQuery: UpdateQuery<Post>,
    options: QueryOptions<Post> = {},
  ) {
    return this.model.findByIdAndUpdate(id, updateQuery, options);
  }

  async find(findQuery) {
    return this.model.find(findQuery).lean();
  }

  async findOne(findQuery) {
    return this.model.findOne(findQuery).lean();
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
        fileUrl: `https://testbuckv1.s3.us-east-2.amazonaws.com/${filePath}`
      },
    };
  }
}
