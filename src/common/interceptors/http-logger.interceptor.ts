import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@lib/config/config.service';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly config: ConfigService) {}
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    if (this.config.get('NODE_ENV') === 'production') {
      return next.handle();
    }
    const http = ctx.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const method = request.method;
    const url = request.url;
    const code = response.statusCode;
    const incomingTime = request['startTime'];

    return next.handle().pipe(
      tap(() => {
        Logger.log(
          `${method} ${url} ${code} ${Date.now() - incomingTime}ms`,
          ctx.getClass().name,
        );
      }),
    );
  }
}
