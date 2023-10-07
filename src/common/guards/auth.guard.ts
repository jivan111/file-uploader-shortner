import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { INVALID_AUTH_TOKEN } from '@src/constants/errors';
import { InfluencerService } from '@src/features/influencer/influencer.service';
import { AppJwtService } from '@src/lib/jwt/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: AppJwtService,
    private readonly influencerService: InfluencerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    let token = request.headers['authorization'];

    if (!token || !token.startsWith('Bearer'))
      throw new HttpException(INVALID_AUTH_TOKEN, HttpStatus.UNAUTHORIZED);

    token = token.split(' ')[1];

    const payload = await this.jwtService.validateToken(token);
    const influencer = await this.influencerService.findById(payload.id);

    if (!influencer)
      throw new HttpException(INVALID_AUTH_TOKEN, HttpStatus.UNAUTHORIZED);

    const leanInfluencer = influencer.toJSON();
    request['influencer'] = leanInfluencer;

    return true;
  }
}
