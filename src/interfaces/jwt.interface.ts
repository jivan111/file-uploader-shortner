import { JwtSubEnum } from '@src/constants/jwt.constants';

export interface IJwtPayload {
  id: string;
  email: string;
}

export interface IJwtDecodeoData extends IJwtPayload {
  iat: number;
  exp: number;
  aud: number;
  iss: number;
  sub: JwtSubEnum;
}

export interface IJwtOptions {
  expiresIn?: string;
  subject?: JwtSubEnum;
}
