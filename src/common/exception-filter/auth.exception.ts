import { HttpStatus } from '@nestjs/common';
import { BusinessException } from './bussines.exception';

export class AuthException extends BusinessException {
  constructor(
    message: string | string[],
    status: HttpStatus = HttpStatus.UNAUTHORIZED,
    errorCode: string = 'AUTH_ERROR',
  ) {
    super(message, status, errorCode, 'AUTH_ERROR');
  }
}
