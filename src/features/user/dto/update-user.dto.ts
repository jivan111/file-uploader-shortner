import {
  IsEmail,
  IsString,
  IsOptional,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName;

  @IsString()
  @IsOptional()
  lastName;

  @IsString()
  @IsOptional()
  password;

  @IsString()
  @IsOptional()
  profileDescription;

  @IsString()
  @IsOptional()
  contentDescription;

  @IsArray()
  // "each" tells class-validator to run the validation on each item of the array
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsOptional()
  contentArea: string[];

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsOptional()
  motivation: string[];
}

export class VerifyOtpDto {
  @IsEmail()
  email;

  @IsString()
  otp;
}
