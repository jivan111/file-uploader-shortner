import { Request, Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@src/lib/config/config.service';
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { httpStatus, message } = this.createErrorObj(exception);

    // this.logger.errorRequest(
    //   `${method} ${url} ${httpStatus} ${Date.now() - now}ms`,
    // );

    const responseBody = {
      isSuccess: false,
      status: httpStatus,
      path: request.originalUrl,
      message,
      stack:
        this.configService.get('NODE_ENV') !== 'production'
          ? exception.stack
          : undefined,
    };

    response.status(httpStatus).json(responseBody);
  }

  createErrorObj(exception: any) {
    let httpStatus: number, message: string | object;
    if (exception instanceof HttpException) {
      message = exception.getResponse();
      httpStatus = exception.getStatus();
    } else if (exception.name === 'CastError') {
      message = exception.message;
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    } else if (exception.name === 'ValidationError') {
      message = exception.message;
      httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
    } else if (exception.name === 'TokenExpiredError') {
      message = 'Access Denied \n Authorization Required';
      httpStatus = HttpStatus.UNAUTHORIZED;
    } else {
      message = 'Internal Server Error';
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return {
      httpStatus,
      message,
    };
  }
}
