import { ArgumentsHost,Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorType: 'BUSINESS_ERROR' | 'SYSTEM_ERROR' = 'SYSTEM_ERROR';
    let errorCode: string | undefined = undefined;

    // Nếu là HttpException (bao gồm cả BusinessException)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object') {
        const r:any = res;
        message = (res as any).message || message;
        errorCode = r.errorCode || undefined;
      }

      // Quy ước: 4xx là BUSINESS_ERROR, còn lại là SYSTEM_ERROR
      errorType = status >= 400 && status < 500 ? 'BUSINESS_ERROR' : 'SYSTEM_ERROR';
    }

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
}
