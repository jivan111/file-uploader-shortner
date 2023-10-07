import {
  Injectable,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpLoggingInterceptor } from '@src/common/interceptors/http-logger.interceptor';
import {
  IJwtDecodeoData,
  IJwtOptions,
  IJwtPayload,
} from '@src/interfaces/jwt.interface';
import { ConfigService } from '@lib/config/config.service';
import { JwtSubEnum } from '@src/constants/jwt.constants';

@Injectable()
@UseInterceptors(HttpLoggingInterceptor)
export class AppJwtService {
  private formattedPrivateKey: string;
  private formattedPublicKey: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.formattedPrivateKey = this.configService
      .get('JWT_PRIVATE_KEY')
      .replace(/\\n/gm, '\n');
    this.formattedPublicKey = this.configService
      .get('JWT_PUBLIC_KEY')
      .replace(/\\n/gm, '\n');
  }

  getToken = async (payload: IJwtPayload, options?: IJwtOptions) => {
    const token = await this.jwtService.signAsync(payload, {
      issuer: this.configService.get('JWT_ISSUER'),
      audience: this.configService.get('JWT_AUDIENCE'),
      subject: options?.subject || JwtSubEnum.AUTHENTICATION_TOKEN,
      algorithm: 'RS256',
      privateKey: this.formattedPrivateKey,
      expiresIn:
        options?.expiresIn || this.configService.get('JWT_EXPIRES_AT') || '7d',
    });

    return token;
  };

  async validateToken(token: string) {
    try {
      const decodedData = await this.jwtService.verifyAsync<IJwtDecodeoData>(
        token,
        {
          publicKey: this.formattedPublicKey,
        },
      );
      return decodedData;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
