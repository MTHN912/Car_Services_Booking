import { createParamDecorator, ExecutionContext, HttpStatus } from '@nestjs/common';
import { BusinessException } from '../exception-filter/bussines.exception';

export const SessionId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const sessionId = request.cookies['session_id'];
    if (!sessionId) {
      throw new BusinessException('Không tìm thấy sessionId', HttpStatus.UNAUTHORIZED);
    }
    return sessionId;
  },
);