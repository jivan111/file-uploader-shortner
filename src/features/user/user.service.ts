import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  CreateInfluencerDto,
  LoginInfluencerDto,
} from './dto/create-user.dto';
import { UpdateInfluencerDto, VerifyOtpDto } from './dto/update-influencer.dto';
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
  INFLUENCER_ALREADY_EXIST,
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

  async create(createInfluencerDto: CreateInfluencerDto) {
    const influencer = await this.model.findOne({
      email: createInfluencerDto.email,
    });

    if (influencer)
      throw new HttpException(
        INFLUENCER_ALREADY_EXIST,
        HttpStatus.UNAUTHORIZED,
      );

    // hash password ,generate otp,create new influencer,send email
    const otp = this.commonUtilsService.generateRandomNumber(
      this.configService.get('OTP_LEN'),
    ),
      hashedPassword = await hash(createInfluencerDto.password, 12);

    return this.model
      .findOneAndUpdate(
        { email: createInfluencerDto.email },
        {
          ...createInfluencerDto,
          password: hashedPassword,
          otp: 9999,
          otpSentAt: new Date(),
        },
        { upsert: true, new: true },
      )
      .then(async (influencer) => {
        await this.emailService.sendEmail({
          emails: [createInfluencerDto.email],
          subject: 'Signup Otp',
          message: `Your signup otp is ${otp}`,
        });
        return { data: influencer };
      })
      .catch((err) => {
        return err;
      });
  }

  async findById(id: string) {
    return await this.model.findById(id);
  }

  findAll() {
    return `This action returns all influencer`;
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

  async update(id: string, updateInfluencerDto: UpdateInfluencerDto) {
    if (updateInfluencerDto.password)
      updateInfluencerDto.password = await hash(
        updateInfluencerDto.password,
        12,
      );

    const updateQuery = {
      $set: updateInfluencerDto,
    };

    if (updateInfluencerDto.contentArea) {
      updateQuery['$addToSet'] = {
        contentArea: { $each: updateInfluencerDto.contentArea },
      };
      delete updateInfluencerDto.contentArea;
    }
    if (updateInfluencerDto.motivation) {
      updateQuery['$addToSet'] = {
        motivation: { $each: updateInfluencerDto.motivation },
      };
      delete updateInfluencerDto.motivation;
    }

    updateQuery['$set'] = updateInfluencerDto;

    return this.model.findByIdAndUpdate(id, updateQuery, { new: true });
  }

  remove(id: number) {
    return `This action removes a #${id} influencer`;
  }

  async login(loginInfluencerDto: LoginInfluencerDto) {
    const influencer = await this.findOne({
      email: loginInfluencerDto.email,
      isVerified: true,
    });
    if (
      !influencer ||
      !(await compare(loginInfluencerDto.password, influencer.password))
    ) {
      throw new HttpException(INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }
    // generate token and send to frontend
    // return influencer
    const token = await this.appJwtService.getToken({
      id: influencer._id.toString(),
      email: influencer.email,
    });

    return { token, data: influencer };
  }

  async forgotPassword(forgotPass: { email: string }) {
    const otp = this.commonUtilsService.generateRandomNumber(
      this.configService.get('OTP_LEN'),
    );

    const influencer = await this.findOneAndUpdate(forgotPass, {
      $set: { otp: otp, otpSentAt: new Date() },
    });

    if (!influencer)
      throw new HttpException(INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);

    return this.emailService
      .sendEmail({
        emails: [influencer.email],
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
    const influencer = await this.findOneAndUpdate(
      { email: verifyOtp.email, otp: verifyOtp.otp },
      { $set: { isVerified: true, otp: '' } },
    );

    if (!influencer)
      throw new HttpException(OTP_MISMATCH, HttpStatus.UNAUTHORIZED);

    const token = await this.appJwtService.getToken({
      id: influencer.id,
      email: influencer.email,
    });

    return { token: token, data: influencer };
  }
}
