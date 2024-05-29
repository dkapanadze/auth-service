import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    console.log(process.env.NODE_ENV, 'env');

    const isProduction = process.env.NODE_ENV === 'production';

    this.logger.error(
      `Http status: ${status}, Error message: ${exception.message}`,
    );
    response.status(status).json(
      isProduction
        ? {
            statusCode: status,
            timestamp: new Date().toISOString(),
            message: exception.message,
          }
        : {
            statusCode: status,
            timestamp: new Date().toISOString(),
            message: exception.message,
            stackTrace: exception.stack,
          },
    );
  }
}
