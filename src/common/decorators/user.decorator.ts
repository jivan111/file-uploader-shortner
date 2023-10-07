import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { user_NOT_FOUND } from '@src/constants/errors';
import { Request } from 'express';
import { FlattenMaps, Types } from 'mongoose';

import {
  User as UserModel,
  UserDocument,
} from '@src/features/user/entities/user.entity';

export const User = createParamDecorator(
  (
    key: keyof FlattenMaps<
      UserModel & { _id: Types.ObjectId; id: string }
    >,
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request['user'] as UserDocument;

    if (!user)
      throw new HttpException(user_NOT_FOUND, HttpStatus.NOT_FOUND);

    return key ? user[key] : user;
  },
);
