import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name;



  @IsEmail()
  email;

  @IsString()
  password;
}

export class LoginUserDto {
  @IsEmail()
  email;

  @IsString()
  password;
}
