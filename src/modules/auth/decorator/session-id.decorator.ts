import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const SessionId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const sessionId = request.cookies['session_id'];
    if (!sessionId) {
      throw new UnauthorizedException('Không tìm thấy sessionId');
    }
    return sessionId;
  },
);