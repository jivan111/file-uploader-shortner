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
  CreateInfluencerDto,
  LoginInfluencerDto,
} from './dto/create-user.dto';
import { UpdateInfluencerDto, VerifyOtpDto } from './dto/update-influencer.dto';
import { AuthGuard } from '@src/common/guards/auth.guard';
import { Influencer } from '@src/common/decorators/user.decorator';
@Controller('influencer')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/signup')
  create(@Body() createInfluencerDto: CreateInfluencerDto) {
    return this.userService.create(createInfluencerDto);
  }

  @Post('/login')
  @HttpCode(200)
  login(@Body() loginInfluencerDto: LoginInfluencerDto) {
    return this.userService.login(loginInfluencerDto);
  }
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Put('forgot-password')
  async forgotPassword(@Body() forgotPass: { email: string }) {
    return this.userService.forgotPassword(forgotPass);
    // let influencer = this.userService.findOne(forgotPass)
    // if (influencer)
  }

  @Put('verify-otp')
  async verifyOtp(@Body() verifyOtp: VerifyOtpDto) {
    return this.userService.verifyOtp(verifyOtp);
    // let influencer = this.userService.findOne(forgotPass)
    // if (influencer)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne({ id });
  }

  @UseGuards(AuthGuard)
  @Put('update-profile')
  update(
    @Influencer('id') id: string,
    @Body() updateInfluencerDto: UpdateInfluencerDto,
  ) {
    return this.userService.update(id, updateInfluencerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
