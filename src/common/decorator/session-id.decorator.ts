import { createParamDecorator, ExecutionContext, HttpStatus } from '@nestjs/common';
import { AuthException } from '../exception-filter/auth.exception';

export const SessionId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const sessionId = request.cookies['session_id'];
    if (!sessionId) {
      throw new AuthException('Session_id không tồn tại', HttpStatus.UNAUTHORIZED, 'SESSION_ID_UNAUTHORIZED');
    }
    return sessionId;
  },
);