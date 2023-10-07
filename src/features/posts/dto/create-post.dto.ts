import { IsEnum, IsString } from 'class-validator';
export class CreatePostDto {
  @IsString()
  videoUrl: string;

}

export class UploadMediaDto {
  @IsString()
  contentType: string;

  @IsString()
  fileName: string;
}
