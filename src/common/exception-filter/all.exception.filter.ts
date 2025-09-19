import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessException } from './bussines.exception';

type ErrorType =
  | 'BUSINESS_ERROR'
  | 'USER_ERROR'
  | 'AUTH_ERROR'
  | 'SYSTEM_ERROR'
  | 'VALIDATION_ERROR';

interface ErrorPayload {
  status: number;
  message: string | string[];
  errorType: ErrorType;
  errorCode?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, message, errorType, errorCode } =
      this.buildErrorPayload(exception);

    response.status(status).json({
      success: false,
      errorType,
      errorCode,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private buildErrorPayload(exception: unknown): ErrorPayload {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let errorType: ErrorType = 'SYSTEM_ERROR';
    let errorCode: string | undefined;

    if (exception instanceof BusinessException) {
      const res = exception.getResponse() as Record<string, any>;
      status = exception.getStatus();
      message = res.message || message;
      errorCode = res.errorCode;
      errorType = (res.error as ErrorType) || 'BUSINESS_ERROR';
    } else if (exception instanceof HttpException) {
      const res = exception.getResponse();
      status = exception.getStatus();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const r = res as Record<string, any>;
        message = r.message || message;
        errorCode = r.errorCode;

        if (status === HttpStatus.BAD_REQUEST && Array.isArray(r.message)) {
          errorType = 'VALIDATION_ERROR';
          message = r.message;
          errorCode = 'VALIDATION_FAILED';
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
    }

    return { status, message, errorType, errorCode };
  }
}
