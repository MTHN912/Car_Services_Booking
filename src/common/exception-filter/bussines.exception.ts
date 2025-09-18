import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    errorCode?: string,
  ) {
    super(
      {
        message,
        error: 'BUSINESS_EXCEPTION',
        errorCode: errorCode || 'BUSINESS_ERROR',
      },
      status,
    );
  }
}
