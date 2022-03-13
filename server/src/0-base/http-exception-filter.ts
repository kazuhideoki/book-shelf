import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomError } from '../type/custom-error';

@Catch(Error)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const timestamp = new Date().toISOString();
    const path = request.url;
    const message = exception.message;
    const customErrorCode = (exception as any).customErrorCode;

    let statusCode;
    if (exception.name === 'HttpException') {
      statusCode = (exception as HttpException).getStatus();
    } else {
      statusCode = 500;
    }

    const error: CustomError = {
      statusCode,
      timestamp,
      path,
      message,
      customErrorCode,
    };

    console.error({ error });

    return response.status(statusCode).json(error);
  }
}
