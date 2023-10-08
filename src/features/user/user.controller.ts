import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  LoginUserDto,
} from './dto/create-user.dto';
import { UpdateUserDto, VerifyOtpDto } from './dto/update-user.dto';
import { AuthGuard } from '@src/common/guards/auth.guard';
import { User } from '@src/common/decorators/user.decorator';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/login')
  @HttpCode(200)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Put('forgot-password')
  async forgotPassword(@Body() forgotPass: { email: string }) {
    return this.userService.forgotPassword(forgotPass);
    // let User = this.userService.findOne(forgotPass)
    // if (User)
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtp: VerifyOtpDto) {
    return this.userService.verifyOtp(verifyOtp);
    // let User = this.userService.findOne(forgotPass)
    // if (User)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne({ id });
  }

  @UseGuards(AuthGuard)
  @Put('update-profile')
  update(
    @User('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
