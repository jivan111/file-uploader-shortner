import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { INFLUENCER_NOT_FOUND } from '@src/constants/errors';
import { Request } from 'express';
import { FlattenMaps, Types } from 'mongoose';

import {
  Influencer as InfluencerModel,
  InfluencerDocument,
} from '@src/features/influencer/entities/influencer.entity';

export const Influencer = createParamDecorator(
  (
    key: keyof FlattenMaps<
      InfluencerModel & { _id: Types.ObjectId; id: string }
    >,
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const influencer = request['influencer'] as InfluencerDocument;

    if (!influencer)
      throw new HttpException(INFLUENCER_NOT_FOUND, HttpStatus.NOT_FOUND);

    return key ? influencer[key] : influencer;
  },
);
