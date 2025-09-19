import { HttpException, HttpStatus } from '@nestjs/common';
export class BusinessException extends HttpException {
  constructor(
    message: string | string[],
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    errorCode: string = 'BUSINESS_ERROR',
    errorType: string = 'BUSINESS_ERROR',
  ) {
    super(
      {
        message,
        error: errorType,
        errorCode: errorCode
      },
      status,
    );
  }
}
