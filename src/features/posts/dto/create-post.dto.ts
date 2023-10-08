import { IsEnum, IsString } from 'class-validator';
export class CreatePostDto {
  @IsString()
  fileUrl: string;

  @IsString()
  fileType: string;

  @IsString()
  fileName: string;

  @IsString()
  fileSize: string;

  @IsString()
  userId: string;

}

export class UploadMediaDto {
  @IsString()
  contentType: string;

  @IsString()
  fileName: string;

  @IsString()
  fileSize: string;
}
