import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import { RequestWithUser } from 'src/auth/interfaces';
import { BaseUser } from 'src/users/interfaces';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithUser<BaseUser>>();

    let status: HttpStatus;
    let errorMessage: string;
    const isProduction = process.env.NODE_ENV === 'production';

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const errorResponse = exception.getResponse();

      errorMessage =
        (errorResponse as HttpErrorResponse).error || exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = 'Critical internal server error';
    }

    const errorResponse = this.getErrorResponse(
      status,
      errorMessage,
      request,
      isProduction,
      exception,
    );

    const errorLog = this.getErrorLog(errorResponse, request, exception);
    this.writeErrorLog(errorLog);

    response.status(status).json(errorResponse);
  }

  private getErrorResponse = (
    status: HttpStatus,
    errorMessage: string,
    request: Request,
    isProduction: boolean,
    exception: unknown,
  ): CustomExceptionResponse => ({
    statusCode: status,
    error: errorMessage,
    timestamp: new Date(),
    path: request.url,
    method: request.method,
    stackTrace: isProduction ? undefined : (exception as HttpException).stack,
  });

  private getErrorLog = (
    errorResponse: CustomExceptionResponse,
    request: RequestWithUser<BaseUser>,
    exception: unknown,
  ): string => {
    const { statusCode, error } = errorResponse;
    const { method, url } = request;
    const { stackTrace, ...filteredResponse } = errorResponse;

    const errorLog = `Http status: ${statusCode} - Method ${method} - URL : ${url}  - userId: ${(request?.user && request.user.id) ?? 'not signed in'}\n
    ${JSON.stringify(filteredResponse)}\n
    ${exception instanceof HttpException ? exception.stack : error}\n\n`;

    this.logger.error(errorLog);

    return errorLog;
  };

  private writeErrorLog = (errorLog: string): void => {
    fs.appendFile('error.log', errorLog, 'utf8', (err) => {
      if (err) throw err;
    });
  };
}

export interface HttpErrorResponse {
  statusCode: number;
  error: string;
}

export interface CustomExceptionResponse extends HttpErrorResponse {
  path: string;
  method: string;
  timestamp: Date;
  stackTrace?: string;
}
