import { IsEnum, IsString } from 'class-validator';
import { PlatformEnum } from '../entities/post.type';
export class CreatePostDto {
  @IsString()
  videoUrl: string;

  @IsEnum(PlatformEnum)
  platform: PlatformEnum;
}

export class UploadMediaDto {
  @IsString()
  contentType: string;

  @IsString()
  fileName: string;
}
