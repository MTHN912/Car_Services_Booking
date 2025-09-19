import { HttpStatus } from '@nestjs/common';
import { BusinessException } from './bussines.exception';

export class UserException extends BusinessException {
  constructor(
    message: string | string[],
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    errorCode: string = 'USER_ERROR',
  ) {
    super(message, status, errorCode, 'USER_ERROR');
  }
}
