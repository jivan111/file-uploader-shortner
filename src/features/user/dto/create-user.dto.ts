import { IsEmail, IsString } from 'class-validator';

export class CreateInfluencerDto {
  @IsString()
  firstName;

  @IsString()
  lastName;

  @IsEmail()
  email;

  @IsString()
  password;
}

export class LoginInfluencerDto {
  @IsEmail()
  email;

  @IsString()
  password;
}
