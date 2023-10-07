import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { INVALID_AUTH_TOKEN } from '@src/constants/errors';
import { UserService } from '@src/features/user/user.service';
import { AppJwtService } from '@src/lib/jwt/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: AppJwtService,
    private readonly userService: UserService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    let token = request.headers['authorization'];

    if (!token || !token.startsWith('Bearer'))
      throw new HttpException(INVALID_AUTH_TOKEN, HttpStatus.UNAUTHORIZED);

    token = token.split(' ')[1];

    const payload = await this.jwtService.validateToken(token);
    const user = await this.userService.findById(payload.id);

    if (!user)
      throw new HttpException(INVALID_AUTH_TOKEN, HttpStatus.UNAUTHORIZED);

    const leanuser = user.toJSON();
    request['user'] = leanuser;

    return true;
  }
}
