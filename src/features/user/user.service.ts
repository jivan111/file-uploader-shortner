import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  CreateUserDto,
  LoginUserDto,
} from './dto/create-user.dto';
import { UpdateUserDto, VerifyOtpDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CommonUtilService } from '@src/util/common-util.service';
import { hash, compare } from 'bcryptjs';

import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { ConfigService } from '@lib/config/config.service';
import { EmailService } from '@lib/communication/email/email.service';
import { AppJwtService } from '@src/lib/jwt/jwt.service';
import {
  EMAIL_SENT_ERROR,
  User_ALREADY_EXIST,
  INVALID_CREDENTIALS,
  OTP_MISMATCH,
} from '@src/constants/errors';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly model: Model<UserDocument>,
    private readonly commonUtilsService: CommonUtilService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly appJwtService: AppJwtService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const User = await this.model.findOne({
      email: createUserDto.email,
    });

    if (User)
      throw new HttpException(
        User_ALREADY_EXIST,
        HttpStatus.UNAUTHORIZED,
      );

    // hash password ,generate otp,create new User,send email
    const otp = this.commonUtilsService.generateRandomNumber(
      this.configService.get('OTP_LEN'),
    ),
      hashedPassword = await hash(createUserDto.password, 12);

    return this.model
      .findOneAndUpdate(
        { email: createUserDto.email },
        {
          ...createUserDto,
          password: hashedPassword,
          otp: otp,
          otpSentAt: new Date(),
        },
        { upsert: true, new: true },
      )
      .then(async (User) => {
        await this.emailService.sendEmail({
          emails: [createUserDto.email],
          subject: 'Signup Otp',
          message: `Your signup otp is ${otp}`,
        });
        return { data: User };
      })
      .catch((err) => {
        return err;
      });
  }

  async findById(id: string) {
    return await this.model.findById(id);
  }

  findAll() {
    return `This action returns all User`;
  }

  findOne(query: QueryOptions<User>) {
    return this.model.findOne(query).lean();
    // return this.model.findById(id)
  }

  findOneAndUpdate(
    query: FilterQuery<User>,
    update: UpdateQuery<User>,
    options?: QueryOptions<User>,
  ) {
    return this.model.findOneAndUpdate(query, update, options || {});
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password)
      updateUserDto.password = await hash(
        updateUserDto.password,
        12,
      );

    const updateQuery = {
      $set: updateUserDto,
    };

    if (updateUserDto.contentArea) {
      updateQuery['$addToSet'] = {
        contentArea: { $each: updateUserDto.contentArea },
      };
      delete updateUserDto.contentArea;
    }
    if (updateUserDto.motivation) {
      updateQuery['$addToSet'] = {
        motivation: { $each: updateUserDto.motivation },
      };
      delete updateUserDto.motivation;
    }

    updateQuery['$set'] = updateUserDto;

    return this.model.findByIdAndUpdate(id, updateQuery, { new: true });
  }

  remove(id: number) {
    return `This action removes a #${id} User`;
  }

  async login(loginUserDto: LoginUserDto) {
    const User = await this.findOne({
      email: loginUserDto.email,
      isVerified: true,
    });
    if (
      !User ||
      !(await compare(loginUserDto.password, User.password))
    ) {
      throw new HttpException(INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }
    // generate token and send to frontend
    // return User
    const token = await this.appJwtService.getToken({
      id: User._id.toString(),
      email: User.email,
    });

    return { token, data: User };
  }

  async forgotPassword(forgotPass: { email: string }) {
    const otp = this.commonUtilsService.generateRandomNumber(
      this.configService.get('OTP_LEN'),
    );

    const User = await this.findOneAndUpdate(forgotPass, {
      $set: { otp: otp, otpSentAt: new Date() },
    });

    if (!User)
      throw new HttpException(INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);

    return this.emailService
      .sendEmail({
        emails: [User.email],
        subject: 'Password reset Otp',
        message: `Your forgot password otp is ${otp}`,
      })
      .then(() => ({
        message: 'Otp for reset password sent successfully',
        statusCode: 200,
      }))
      .catch(() => {
        throw new HttpException(EMAIL_SENT_ERROR, HttpStatus.UNAUTHORIZED);
      });
  }

  async verifyOtp(verifyOtp: VerifyOtpDto) {
    const User = await this.findOneAndUpdate(
      { email: verifyOtp.email, otp: verifyOtp.otp },
      { $set: { isVerified: true, otp: '' } },
    );

    if (!User)
      throw new HttpException(OTP_MISMATCH, HttpStatus.UNAUTHORIZED);

    const token = await this.appJwtService.getToken({
      id: User.id,
      email: User.email,
    });

    return { token: token, data: User };
  }
}
